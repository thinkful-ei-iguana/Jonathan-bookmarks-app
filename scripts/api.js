const API = (function() {
  
  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/jonathan';

  // Send GET request to database
  function getBookmarks(callback) {
    $.getJSON(`${BASE_URL}/bookmarks`, callback);
  }

  // Create new bookmark, POST to database
  function createBookmark(bookmarkObject, callback, errorCallback) {
    $.ajax({
      url: `${BASE_URL}/bookmarks`,
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(bookmarkObject),
      success: callback,
      error: errorCallback
    });
  }

  // Send DELETE request to database
  function deleteBookmark(id, callback, errorCallback) {
    $.ajax({
      url: `${BASE_URL}/bookmarks/${id}`,
      method: 'DELETE',
      success: callback,
      error: errorCallback
    });
  }

  // Update new bookmark
  function updateBookmark(id, updateObject, callback, errorCallback) {
    $.ajax({
      url: `${BASE_URL}/bookmarks/${id}`,
      method: 'PATCH',
      contentType: 'application/json',
      data: JSON.stringify(updateObject),
      success: callback,
      error: errorCallback
    });
  }

  return {
    createBookmark,
    deleteBookmark,
    getBookmarks,
    updateBookmark
  };
})();