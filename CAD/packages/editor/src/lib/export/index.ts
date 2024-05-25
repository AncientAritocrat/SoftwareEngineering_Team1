
import JSZip  from 'jszip'
// @ts-ignore
import { saveAs } from 'file-saver';
// 导出项目
export const exportProject = async (zipUrl: string, pathCfg: string, pathProg: string, config: any) => {
    try {
        let response: any = await fetch(zipUrl);
        if (response.status === 200 || response.status === 0) {
            response = response.blob();
        } else {
            window.$message.error("导出失败:" + response.statusText )
            return;
        }
        const zip = await JSZip.loadAsync(response);
        //const txt = await zip.file(path)?.async("string");
        const isHtml = zipUrl.indexOf("html") >= 0;
        zip.file(pathCfg, (isHtml ? "var config = " : "export default ") + JSON.stringify(config, null, 4));
        let programCode = await zip.file(pathProg)?.async("string");
        if (programCode) {
            programCode = programCode?.replace("// onMapLoadedCode", config.program?.onMapLoaded ?? '');
            zip.file(pathProg, programCode ?? "");
        }
        const blob = await zip.generateAsync({type:"blob"});
        saveAs(blob, zipUrl);
    } catch (error) {
        window.$message.error("导出失败" + error)
    }
}