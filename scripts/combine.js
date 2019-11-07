/* global $ */
const Combine = (function() {
  $.fn.extend({
    serializeJSON: function() {
      const formData = new FormData(this[0]);
      const object = {};
      formData.forEach((value, name) => {
        return (object[name] = value);
      });
      return JSON.stringify(object);
    }
  });
})();