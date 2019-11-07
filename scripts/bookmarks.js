/* global Store, API, HTMLBuild */

const Bookmarks = (function() {
  // Event listeners
  function bindEventListeners() {
    handleNewClick();
    handleAddClick();
    handleDeleteClick();
    handleFilterMenu();
    handleExpandedView();
    handleEditClick();
    handleCancel();
    handleOnChange();
  }

  function handleOnChange(){
    
    $('body').on('change', '#js-form-url', e => {
      const value = e.target.value;
      if (value.indexOf('http')!== 0){
        e.target.value = 'https://' + value;
      }
    });
  }

  // Handle new bookmark button click
  function handleNewClick() {
    $('#js-new-bookmark').on('click', () => {
      Store.toggleAddingBookmark(true);
      Store.toggleUpdatingBookmark(false);
      render();
    });
  }

  // Handle add bookmark click
  function handleAddClick() {
    $('#js-form-container').on('submit', '#js-new-item-form', event => {
      event.preventDefault();
      // Parse serialized JSON into object
      const serializedJSON = JSON.parse($(event.target).serializeJSON());
      const newBookmarkObject = constructBookmarkObject(serializedJSON);

      API.createBookmark(
        newBookmarkObject,
        newBookmark => {
          // Add bookmark to Store
          Store.addBookmarkToStore(newBookmark);
          // Toggle form 'hide !hide'
          Store.toggleAddingBookmark(false);
          // Render
          render();
        },
        error => errorCallback(error)
      );
    });
  }

  // Handle Delete bookmark click
  function handleDeleteClick() {
    $('.js-bookmarks-container').on('click', '.js-btn-delete', event => {
      // Get ID
      const bookmarkUniqueID = getDataID(event.currentTarget);
      const confirmedDeletion = confirm(
        'Are you sure?'
      );
      if (confirmedDeletion) {
        API.deleteBookmark(
          bookmarkUniqueID,
          () => {
            // Delete from store
            Store.findAndDelete(bookmarkUniqueID);
            render();
          },
          error => errorCallback(error)
        );
      }
    });
  }

  // Handle Edit button
  function handleEditClick() {
    $('.js-bookmarks-container').on('click', '.js-btn-edit', event => {
      // Find in Store by ID
      const bookmarkUniqueID = getDataID(event.currentTarget);
      const currentBookmarkObject = Store.findByID(bookmarkUniqueID);
      Store.toggleUpdatingBookmark(true);
      Store.toggleAddingBookmark(false);
      Store.setEditingObject(currentBookmarkObject);
      render();

    
      $('#js-edit-form').on('submit', event => {
        event.preventDefault();

        // Values to pass to builder
        const title = $('#js-form-title').val();
        const description = $('#js-form-description').val();
        const url = $('#js-form-url').val();
        const rating = $('#js-form-rating').val();

        const editedObject = constructBookmarkObject({
          title: title,
          rating: rating,
          description: description,
          url: url
        });

        // Update bookmark in API
        API.updateBookmark(
          bookmarkUniqueID,
          editedObject,
          () => {
            // Update bookmark in Store

            Store.updateBookmark(bookmarkUniqueID, editedObject);
            Store.toggleUpdatingBookmark(false);
            Store.resetEditingObject();
            render();
          },
          error => errorCallback(error)
        );
      });
    });
  }

  // Handle Cancel button
  function handleCancel() {
    $('#js-form-container').on('click', '#js-cancel-bookmark', () => {
      Store.toggleAddingBookmark(false);
      Store.toggleUpdatingBookmark(false);
      render();
    });
  }

  // Handle drop down menu filtering
  function handleFilterMenu() {
    $('#js-filter-control').change(() => {
      Store.setRatingFilter(getRatingsFilterDropdownValue());
      render();
    });
  }

  // Get Ratings
  function getRatingsFilterDropdownValue() {
    return $('#js-filter-control').val();
  }

  // Handle expanded
  function handleExpandedView() {
    $('.js-bookmarks-container').on('click', '.js-bookmark-header', event => {
      Store.toggleExpand(getDataID(event.currentTarget));
      render();
    });
  }

  //Error handling

  function errorCallback(error) {
    Store.setErrorMessage(`Error - ${getErrorMessage(error)}`);
    render();
  }

  // Get error message
  function getErrorMessage(error) {
    return error.responseJSON.message;
  }
  //
  //
  // build new bookmark object
  function constructBookmarkObject(serializedJSON) {
    const newObject = {};

    if (serializedJSON.title.length > 0) {
      newObject['title'] = serializedJSON.title;
    } else {
      newObject['title'] = '';
    }

    if (serializedJSON.url.length > 5) {
      newObject['url'] = serializedJSON.url;
    } else {
      newObject['url'] = '';
    }

    if (serializedJSON.description.length > 0) {
      newObject['desc'] = serializedJSON.description;
    }

    if (
      parseInt(serializedJSON.rating) > 0 &&
      parseInt(serializedJSON.rating) <= 5
    ) {
      newObject['rating'] = serializedJSON.rating;
    }

    return newObject;
  }

  
  // Get data-id value of bookmark
  function getDataID(bookmark) {
    return getDataIDAttributeValue(bookmark);
  }

  // Get data-id attribute of closest js-bookmark-item
  function getDataIDAttributeValue(bookmark) {
    return $(bookmark)
      .closest('.js-bookmark-item')
      .attr('data-id');
  }

  // Clear form values
  function clearFormValues() {
    $('#js-form-title').val('');
    $('#js-form-description').val('');
    $('#js-form-url').val('');
    $('#js-form-rating').val('');
  }

  // Render
  function render() {
    const bookmarks = Store.bookmarks;
    const filterValue = Store.ratingFilter;
    let bookmarkListHTML;

    if (Store.checkAddBookmark()) {
      // Add form to page, or clear form container
      $('#js-form-container').html(HTMLBuild.buildNewForm());
    } else if (Store.checkEditBookmark()) {
      $('#js-form-container').html(HTMLBuild.buildUpdatedForm());
    } else {
      $('#js-form-container').html('');
    }

    // Clear form when user makes edits
    if (Store.editingObject && !Store.checkAddBookmark()) {
      $('#js-form-title').val(Store.editingObject.title);
      $('#js-form-description').val(Store.editingObject.desc);
      $('#js-form-url').val(Store.editingObject.url);
      $('#js-form-rating').val(Store.editingObject.rating);
    } else if (!Store.checkAddBookmark()) {
      clearFormValues();
    }

    // Display errors
    if (Store.errorMessage) {
      $('#js-error-message').html(Store.errorMessage);
      Store.setErrorMessage('');
    } else {
      $('#js-error-message').html('');
    }

    // Render by rating
    if (filterValue > 0) {
      bookmarkListHTML = HTMLBuild.generateBookmarksListHTML(
        bookmarks,
        filterValue
      );
      $('.js-bookmarks-container').html(bookmarkListHTML);
    } else {
      bookmarkListHTML = HTMLBuild.generateBookmarksListHTML(
        bookmarks,
        filterValue
      );
      $('.js-bookmarks-container').html(bookmarkListHTML);
    }
  }

  return {
    render,
    bindEventListeners
  };
})();