export interface ExportResponseModel {

    fileName:string;
   
    filePath:string;
   
    format:
      "png"
      | "svg"
      | "pdf"
      | "csv"
      | "xlsx";
   
   }