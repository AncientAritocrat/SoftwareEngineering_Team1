/// <reference types="vite/client" />

import type { DialogApiInjection } from "naive-ui/lib/dialog/src/DialogProvider";
import type { MessageApiInjection } from "naive-ui/lib/message/src/MessageProvider";
import type { NotificationApiInjection } from "naive-ui/lib/notification/src/NotificationProvider";
import type { LoadingBarInst } from "naive-ui/lib/loading-bar/src/LoadingBarProvider";
 
declare global {
    interface Window {
        $message: MessageApiInjection;
        $dialog: DialogApiInjection;
        $notification: NotificationApiInjection;
        $loadingBar: LoadingBarInst;
    }
}