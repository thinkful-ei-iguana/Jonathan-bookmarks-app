// eslint-disabled-next-line no-unused-vars
const Store = (function() {
  // Mutating The Store
  // Adding a bookmark to the store
  function addBookmarkToStore(bookmarkObject) {
    const defaultObjectProperties = {
      expanded: false
    };
    this.bookmarks.push(Object.assign(bookmarkObject, defaultObjectProperties));
  }

  // Update bookmark
  function updateBookmark(bookmarkID, mergeBookmark) {
    const object = this.bookmarks.find(bookmark => bookmark.id === bookmarkID);
    Object.assign(object, mergeBookmark);
  }

  // Toggle "adding bookmark"
  function toggleAddingBookmark(bool) {
    this.addingBookmark = bool;
  }

  // Toggle "updating bookmark"
  function toggleUpdatingBookmark(bool) {
    this.updatingBookmark = bool;
  }

  // Delete bookmark by ID
  function deleteBookmark(bookmarkID) {
    this.bookmarks = this.bookmarks.filter(
      bookmark => bookmark.id !== bookmarkID
    );
  }

  // Filter bookmarks by rating
  function filterBookmarksByRating(rating) {
    setRatingFilter(rating);
    this.bookmarks = filterStoreBookmarks();
  }

  // Store bookmarks according to rating
  function filterStoreBookmarks() {
    this.bookmarks.filter(bookmark => bookmark.rating >= this.ratingFilter);
  }

  // Toggle expanded status of bookmark (BY ID)
  function toggleExpand(bookmarkID) {
    const bookmarkToToggle = this.bookmarks.find(
      bookmark => bookmark.id === bookmarkID
    );
    bookmarkToToggle.expanded = !bookmarkToToggle.expanded;
  }

 
  // Set error messages
  function setError(error) {
    this.errorMessage = error;
  }

  // Set rating filter
  function setRatingFilter(value) {
    this.ratingFilter = value;
  }

  
  // Find bookmark by ID
  function findByID(bookmarkID) {
    return this.bookmarks.find(bookmark => bookmark.id === bookmarkID);
  }

  // Find and delete bookmark by ID
  function findAndDelete(bookmarkID) {
    this.bookmarks = this.bookmarks.filter(
      bookmark => bookmark.id !== bookmarkID
    );
  }

  // Check hidden status of bookmark
  function checkHiddenStatus(bookmark) {
    return !bookmark.expanded ? 'hidden' : '';
  }

  // Check if adding bookmark
  function checkAddBookmark() {
    return this.addingBookmark;
  }

  // Check if editing bookmark
  function checkEditBookmark() {
    return this.updatingBookmark;
  }

  // Set editing object
  function setEditingObject(object) {
    this.editingObject.title = object.title;
    this.editingObject.desc = object.desc;
    this.editingObject.url = object.url;
    this.editingObject.rating = object.rating;
  }

  // Reset editing object
  function resetEditingObject() {
    this.editingObject = {};
  }

  return {
    bookmarks: [],
    ratingFilter: 0,
    editingObject: {},
    addBookmarkToStore,
    checkAddBookmark,
    toggleAddingBookmark,
    deleteBookmark,
    filterBookmarksByRating,
    toggleExpand,
    setError,
    findByID,
    setRatingFilter,
    findAndDelete,
    checkHiddenStatus,
    updateBookmark,
    toggleUpdatingBookmark,
    checkEditBookmark,
    setEditingObject,
    resetEditingObject
  };
})();