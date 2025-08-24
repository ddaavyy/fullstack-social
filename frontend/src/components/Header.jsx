import { useNavigate } from 'react-router-dom';
import { LogoutOutlined,SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown } from 'antd';

import { clearAllClientCookies } from '../utils/clearCookies';

const menuItems = [
    { key: 'profile', label: 'Profile', icon: <UserOutlined /> },
    { key: 'settings', label: 'Settings', icon: <SettingOutlined /> },
    { key: 'logout', label: 'Logout', icon: <LogoutOutlined />, danger: true },
];

export default function Header() {
    const navigate = useNavigate();

    const onMenuClick = ({ key }) => {
        if (key === 'logout') {
            clearAllClientCookies();
            try { localStorage.clear(); } catch { }
            try { sessionStorage.clear(); } catch { }
            navigate('/login');
            return;
        }
        navigate(`/${key}`);
    };

    return (
        <div className="flex">
            <Dropdown menu={{ items: menuItems, onClick: onMenuClick }} trigger={['click']} placement="bottomRight">
                <div className="cursor-pointer">
                    <Avatar
                        size={40}
                        src="https://i.pravatar.cc/120?img=17"
                        style={{ border: '2px solid rgba(255,255,255,0.35)' }}
                    />
                </div>
            </Dropdown>
        </div>
    );
}
