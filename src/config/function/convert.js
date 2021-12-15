export function convert(array) {
  var map = {};
  for (var i = 0; i < array.length; i++) {
    var obj = array[i];
    if (!(obj.id in map)) {
      map[obj.id] = obj;
      map[obj.id].children = [];
    }

    if (typeof map[obj.id].name == "undefined") {
      map[obj.id].id = obj.id;
      map[obj.id].name = obj.name;
      map[obj.id].parent = obj.parent;
      map[obj.id].value = obj.value;
      map[obj.id].label = obj.label;
    }

    var parent = obj.parent || "-";
    if (!(parent in map)) {
      map[parent] = {};
      map[parent].children = [];
    }

    map[parent].children.push(map[obj.id]);
  }
  return map["-"];
}
