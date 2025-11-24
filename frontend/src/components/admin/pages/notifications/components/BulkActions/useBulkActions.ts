import { useNotifications } from "@/hooks/common/useNotifications";

export const useBulkActions = ({ selectedNotifications, setSelectedNotifications }: { selectedNotifications: Set<string>, setSelectedNotifications: (notifications: Set<string>) => void }) => {
  const { get, markAsRead } = useNotifications();
  const { data: allNotifications } = get({ take: 1000, skip: 0 });

  const handleSelectAll = () => {
    if (!allNotifications?.items) return;

    if (selectedNotifications.size === allNotifications.items.length) {
      setSelectedNotifications(new Set());
    } else {
      setSelectedNotifications(new Set(allNotifications.items.map(n => n.id)));
    }
  };

  const handleBulkMarkAsRead = async () => {
    if (selectedNotifications.size > 0) {
      await markAsRead.mutateAsync({ ids: Array.from(selectedNotifications) });
      setSelectedNotifications(new Set());
    }
  };


  return {
    handleSelectAll,
    handleBulkMarkAsRead,
    allNotifications,
    markAsRead,
  };
};