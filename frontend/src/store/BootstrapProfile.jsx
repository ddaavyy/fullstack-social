import { useEffect } from "react";

import useProfileStore from "./useProfileStore";

export default function BootstrapProfile() {
    const ensureProfile = useProfileStore(s => s.ensureProfile);

    useEffect(() => {
        ensureProfile?.().catch(() => { });
    }, [ensureProfile]);

    return null;
}
