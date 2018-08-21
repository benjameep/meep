module.exports = function Meep(){
  const varkeys={},
    $=Symbol('here')
    $keys=Symbol('keys')
    Node = () => ({[$keys]:[]}),
    rootnode=Node(),
    nodes=[],
    next=[],
    dimorder={}

  let nullkey,dimcount=0

  function meep(search,val){
    var i,j,k,temp,keys,ids = Array(dimcount).fill()
    for(let key in search){
      if(dimorder[key]==undefined){
        dimorder[key] = dimcount++
      }
      ids[dimorder[key]] = search[key]
    }
    nodes[0]=rootnode, nodes.length=1, next.length=0
    
    // For Each of the ids
    for(i = 0; i < ids.length; ++i){
      // For Each of our iterators
      for(j = 0; j < nodes.length; ++j){
        // If nullkey then add all of the children to our iterators list
        if(ids[i]===undefined||ids[i]===nullkey){
          // curious whether this cache of keys is actually worth it
          for(k = 0,keys=nodes[j][$keys]; k < keys.length; ++k){
            next.push(nodes[j][keys[k]])
          }
        } else if(varkeys[ids[i]]||typeof ids[i]=='function'){
          for(k = 0,keys=nodes[j][$keys]; k < keys.length; ++k){
            if((varkeys[ids[i]] || ids[i])(keys[k])){
              next.push(nodes[j][keys[k]])
            }
          }
        } else {
          // console.log(nodes,j)
          if(nodes[j][ids[i]]===undefined){
            if(arguments.length>1){
              nodes[j][ids[i]] = Node()
              nodes[j][$keys].push(ids[i])
              next.push(nodes[j][ids[i]])
            }
          } else {
            next.push(nodes[j][ids[i]])
          }
        }
      }
      temp = nodes
      nodes = next
      next = temp
      next.length = 0
    }

    return nodes.map(n => arguments.length>1 ? n[$]=val : n[$])
  }

  meep.var = function(key,filterfn){
    if(arguments.length>1){
      if(filterfn && typeof filterfn != 'function') throw new Error('var value is not a function');
      varkeys[key] = filterfn
      return meep
    } else {
      return varkeys[key]
    }
  }
  meep.null = function(_){return arguments.length ? (nullkey=_,meep) : nullkey}
  return meep
}