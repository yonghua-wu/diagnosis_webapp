import http, { HttpResponseBase, PaginationModel } from "./base";

const modelName = "job-overtime-type";

export interface JobOvertimeTypeModel {
  // 	小区id	string
  blockId: string;
  // 	处理方式code	integer(int32)
  code: number;
  // 		string
  createdBy: string;
  // 		string
  createdId: string;
  // 		string(date-time)
  createdTimestring: string;
  // 	ID	integer(int32)
  jobOvertimeTypeId: number;
  // 	名称：短信、IM、app推送	string
  name: string;
  // 	备注	string
  remark: string;
  // 	状态	integer(int32)
  status: number;
  // 		string
  tenantId: string;
  // 		string
  updatedBy: string;
  // 		string
  updatedId: string;
  // 		string(date-time)
  updatedTimestring: string;
}

export default class JobOvertimeType {
  public static async all() {
    const res = await http.get<HttpResponseBase<JobOvertimeTypeModel[]>>(`/${modelName}/getList`);
    if (res.code === 200) {
      return res.data;
    } else {
      throw res;
    }
  }
}
