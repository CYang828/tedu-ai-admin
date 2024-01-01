import request from "./axios";

// 题库管理api
const questionsBankApi = {
    //    获取学科列表 /api/v1/subjects/list
    async subjectsList() {

        const result = await request({
            url: "/api/v1/subjects/list",
            method: "get",
        });
        return Promise.resolve(result);
    },
    //    获取知识专题列表树(全部) /api/v1/specialTopics/tree
    async specialTopicsList(params) {

        const result = await request({
            url: "/api/v1/specialTopics/tree",
            method: "get",
            params
        });
        return Promise.resolve(result.data);
    },
    //   分级查询专题列表 subjectId / parentId
    async specialTopicsListLevel1(params) {

        const result = await request({
            url: "/api/v1/specialTopics/lv1",
            method: "get",
            params
        });
        return Promise.resolve(result.data);
    },
    async specialTopicsListLevel2(params) {

        const result = await request({
            url: "/api/v1/specialTopics/lv2",
            method: "get",
            params
        });
        return Promise.resolve(result.data);
    },
    async specialTopicsListLevel3(params) {

        const result = await request({
            url: "/api/v1/specialTopics/lv3",
            method: "get",
            params
        });
        return Promise.resolve(result.data);
    },
    //   分页顺序获取练习题
    async questionsPageQuery(params) {
      for(let key in params){
        let value = params[key]
        if(!value){
          delete params[key]
        }
      }
      const result = await request({
          url: "/api/v1/questions/pageQuery",
          method: "get",
          params
      });
      return Promise.resolve(result.data);
    },
  // 修改习题
  async updateExercise(data) {
    const result = await request({
        url: "/api/v1/questions/update",
        method: "POST",
        data
    });
    return Promise.resolve(result.data);
  },
  // 修改习题状态
  async updateStateExercise(data) {
    const result = await request({
        url: "/api/v1/questions/updateState",
        method: "POST",
        data
    });
    return Promise.resolve(result.data);
  },
  // 删除习题
  async deleteExercise(data) {
    const result = await request({
        url: "/api/v1/questions/delete",
        method: "POST",
        data
    });
    return Promise.resolve(result.data);
  },
  // ai生成题目
  async aiGenerate(params){
    const result = await request({
      url: "/api/v1/questions/aiGenerate",
      method: "get",
      params
    })
    return Promise.resolve(result.data);
  } 
};

export default questionsBankApi;