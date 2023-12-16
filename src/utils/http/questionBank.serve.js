import request from "./axios";

// 题库管理api
const apis = {
//    获取学科列表 /api/v1/subjects/list
    async subjectsList(data) {
      //外审意见
      const result = await request({
            url: dev + "/api/v1/subjects/list",
            method: "get",
        });
        return await Promise.resolve(result.data);
    },
    
  };
  
  export default apis;