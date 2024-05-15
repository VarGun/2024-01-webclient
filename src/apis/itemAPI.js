// itemAPI.js

import { customAxios } from "./customAxios";

export default {
  getAllItemList() {
    return customAxios.get("/items");
  },
  getItem(itemId) {
    return customAxios.get(`/items/${itemId}`);
  },
  createItem(authToken, itemData) {
    return customAxios.post("/items", itemData, {
      headers: {
        Authorization: authToken,
      },
    });
  },
  updateItem(authToken, itemId, itemData) {
    return customAxios.patch(`/items/${itemId}`, itemData, {
      headers: { Authorization: authToken },
    });
  },
};
