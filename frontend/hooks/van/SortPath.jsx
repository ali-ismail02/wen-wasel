const SortPath = (array) => {
    return array.sort(function(a,b){
        return ((new Date(a[1])) - (new Date(b[1])));
      });
}

export default SortPath;