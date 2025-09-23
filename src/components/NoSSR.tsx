'use client';

import { useEffect, useState } from 'react';

interface NoSSRProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

/**
 * NoSSR component prevents server-side rendering for its children.
 * This helps avoid hydration mismatches caused by browser extensions
 * or client-only code that behaves differently on server vs client.
 */
export default function NoSSR({ children, fallback = null }: NoSSRProps) {
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    if (!hasMounted) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}

