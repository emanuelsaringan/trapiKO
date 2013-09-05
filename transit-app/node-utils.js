var NodeUtils = {
  isEmptyObject : function(obj) {
    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        return false;
      }
    }

    return true;
  }
};

exports.NodeUtils = NodeUtils;