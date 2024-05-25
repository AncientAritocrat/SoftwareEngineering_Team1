import FormInput from "@/components/FormInput.vue"
import type { EditorUi } from "./editorUI"
export const getFormInput = async (uiApp: EditorUi, title: string, props: any, listeners: any, width?: string, height?: string) => {
    return await uiApp.showModalAsync(title, title, {
        component: FormInput,
        props: {
            ...props,
            width: width ?? '600px',
            height: height ?? '500px',
        },
        listeners: listeners
    })
}