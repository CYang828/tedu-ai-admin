import request from "./axios";

// 题库管理api
const questionsBankApi = {
//    获取学科列表 /api/v1/subjects/list
    async subjectsList() {
      //外审意见
      const result = await request({
            url: "/api/v1/subjects/list",
            method: "get",
        });
        return  Promise.resolve(result.data);
    },
    
  };
  
  export default questionsBankApi;