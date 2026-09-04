import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Megaphone } from 'lucide-react';

interface FlashAlertsProps {
    flash?: { message?: string; error?: string };
}

export default function FlashAlerts({ flash }: FlashAlertsProps) {
    if (!flash?.message && !flash?.error) return null;

    return (
        <div className="mb-4 space-y-3">
            {flash.message && (
                <Alert variant="success">
                    <Megaphone />
                    <AlertTitle>Notification</AlertTitle>
                    <AlertDescription>{flash.message}</AlertDescription>
                </Alert>
            )}
            {flash.error && (
                <Alert variant="destructive">
                    <Megaphone />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{flash.error}</AlertDescription>
                </Alert>
            )}
        </div>
    );
}