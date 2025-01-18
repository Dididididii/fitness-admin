import { loginAPI } from "@/api/user";
import { getToken, setToken } from "@/utils/auth";

export default {
  namespaced: true,
  state: {
    token: getToken() || "",
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
      setToken(token);
    },
  },
  actions: {
    async userLogin(store, form) {
      const res = await loginAPI(form);
      store.commit("setToken", res.token);
      // console.log(res);
    },
  },
};
