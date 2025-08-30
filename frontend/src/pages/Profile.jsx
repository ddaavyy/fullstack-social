import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LoadingOutlined, LockOutlined, MailOutlined, SaveOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Divider, Form, Input, message, Typography, Upload } from 'antd';

import api from '../api/axios';
import { useProfileByIdQuery, useSyncProfileCache } from '../api/profile/profile';
import { useProfile } from '../store/useProfileStore';

const allowTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const beforeUpload = (file) => {
    if (!allowTypes.includes(file.type)) { message.error('Use JPG, PNG ou WEBP.'); return Upload.LIST_IGNORE; }
    if (file.size > 2 * 1024 * 1024) { message.error('A imagem deve ter até 2MB.'); return Upload.LIST_IGNORE; }
    return true;
};

export default function Profile() {
    const { id } = useParams();
    const me = useProfile();
    const { data: byIdData, isLoading: byIdLoading } = useProfileByIdQuery(id, { enabled: !!id && Number(id) !== me?.id });
    const { syncSelf, syncById } = useSyncProfileCache();

    const isById = !!id && Number(id) !== me?.id;
    const profile = isById ? byIdData : me;
    const loading = isById ? byIdLoading : (!me);

    const [form] = Form.useForm();
    const [pwForm] = Form.useForm();
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (profile) form.setFieldsValue({ username: profile.username, email: profile.email });
    }, [profile, form]);

    const avatarText = useMemo(() => (profile?.username?.[0] || profile?.email?.[0] || 'U').toUpperCase(), [profile]);
    const endpoint = isById ? `profile/${id}/` : 'profile/';

    const onSaveProfile = async (values) => {
        setSaving(true);
        try {
            const fd = new FormData();
            if (values.username && values.username !== profile?.username) fd.append('username', values.username);
            const { data } = await api.patch(endpoint, fd);
            if (isById) syncById(id, data);
            else syncSelf(data);
            message.success('Perfil atualizado!');
        } catch (e) {
            const err = e?.response?.data;
            message.error(err?.username?.[0] || err?.detail || 'Não foi possível atualizar.');
        } finally {
            setSaving(false);
        }
    };

    const doUploadPhoto = async (file) => {
        if (!beforeUpload(file)) return;
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append('photo', file);
            const { data } = await api.patch(endpoint, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            if (isById) syncById(id, data);
            else syncSelf(data);
            message.success('Foto atualizada!');
        } catch (e) {
            message.error(e?.response?.data?.detail || 'Falha ao enviar a foto.');
        } finally {
            setUploading(false);
        }
    };

    const onChangePassword = async (values) => {
        try {
            if (values.new_password !== values.confirm_password) {
                message.error('A confirmação de senha não confere.');
                return;
            }
            await api.post('change-password/', {
                user_id: isById ? Number(id) : undefined,
                current_password: values.current_password,
                new_password: values.new_password,
            });
            pwForm.resetFields();
            message.success('Senha atualizada com sucesso!');
        } catch (e) {
            message.error(e?.response?.data?.detail || 'Não foi possível alterar a senha.');
        }
    };

    if (loading && !profile) {
        return <div className="flex items-center justify-center h-[60vh]"><LoadingOutlined className="text-2xl" /></div>;
    }

    return (
        <div className="min-h-[calc(100dvh-64px)] px-4 md:py-12 py-6 flex justify-center items-start bg-[#0f1b2b]">
            <div className="w-full max-w-2xl">
                <Card className="w-full max-w-2xl bg-[#152233]/90 border border-slate-700/60 rounded-2xl shadow-xl" bordered styles={{ body: { padding: 24 } }}>
                    <Typography.Title level={3} style={{ color: 'white', marginBottom: 4 }}>
                        {isById ? `Perfil #${id}` : 'Meu perfil'}
                    </Typography.Title>
                    <Typography.Text style={{ color: 'rgba(255,255,255,.65)' }}>
                        Gerencie suas informações da conta
                    </Typography.Text>

                    <Divider className="!my-6 !border-white/10" />

                    <div className="flex items-center gap-4">
                        <Avatar size={84} src={profile?.photo_url || null} icon={!profile?.photo_url && <UserOutlined />}
                            style={{ background: 'linear-gradient(135deg,#1f2a44,#22304f)', color: 'white' }}>
                            {!profile?.photo_url && avatarText}
                        </Avatar>

                        <div className="flex flex-col gap-2">
                            <Upload accept="image/png,image/jpeg,image/webp" showUploadList={false}
                                customRequest={({ file, onSuccess }) => { doUploadPhoto(file); onSuccess?.('ok'); }}
                                beforeUpload={beforeUpload}>
                                <Button icon={<UploadOutlined />} loading={uploading}>Trocar foto</Button>
                            </Upload>
                            <Typography.Text type="secondary" className="text-slate-300">JPG, PNG ou WEBP até 2MB.</Typography.Text>
                        </div>
                    </div>

                    <Divider className="!my-8 !border-white/10" />

                    <Form form={form} layout="vertical" onFinish={onSaveProfile} colon={false}
                        className="[&_.ant-form-item-label>label]:text-slate-200">
                        <Form.Item label="Usuário" name="username"
                            rules={[{ required: true, message: 'Informe um nome de usuário' }, { min: 3, message: 'Mínimo de 3 caracteres' }]}>
                            <Input placeholder="seu nome de usuário" />
                        </Form.Item>

                        <Form.Item label="Email" name="email">
                            <Input disabled prefix={<MailOutlined />} />
                        </Form.Item>

                        <Form.Item style={{ marginBottom: 0 }}>
                            <Button htmlType="submit" icon={<SaveOutlined />} size="large" block shape="round" loading={saving}>
                                Salvar alterações
                            </Button>
                        </Form.Item>
                    </Form>

                    <Divider className="!my-8 !border-white/10" />

                    <Typography.Title level={4} style={{ color: 'white', marginBottom: 12 }}>Alterar senha</Typography.Title>
                    <Form form={pwForm} layout="vertical" onFinish={onChangePassword} requiredMark={false} colon={false}>
                        <Form.Item label="Senha atual" name="current_password" rules={[{ required: true, message: 'Digite sua senha atual' }]}>
                            <Input.Password prefix={<LockOutlined />} />
                        </Form.Item>
                        <Form.Item label="Nova senha" name="new_password"
                            rules={[{ required: true, message: 'Digite a nova senha' }, { min: 6, message: 'Mínimo de 6 caracteres' }]}>
                            <Input.Password prefix={<LockOutlined />} />
                        </Form.Item>
                        <Form.Item label="Confirmar nova senha" name="confirm_password" dependencies={['new_password']}
                            rules={[{ required: true, message: 'Confirme a nova senha' },
                            ({ getFieldValue }) => ({ validator(_, v) { return (!v || getFieldValue('new_password') === v) ? Promise.resolve() : Promise.reject(new Error('As senhas não coincidem')); } })]}>
                            <Input.Password prefix={<LockOutlined />} />
                        </Form.Item>
                        <Form.Item style={{ marginBottom: 0 }}>
                            <Button block size="large" shape="round" htmlType="submit">Atualizar senha</Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </div>
    );
}
