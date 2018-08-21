# Meep
A Multi-dimensional Map

## Theory
Say you have some sort of many to many dataset, with lots and lots of dimensions, and you want to filter it down to where only a couple of the dimensions you don't care about it's value. So for example you have a dictionary of three letter words and you want to find all the words that fit `_at`

``` js
const Meep = require('meep')
const meep = Meep().null('_')

meep('bat',{word:'bat'})
meep('ben',{word:'ben'})
meep('sat',{word:'sat'})
meep('mat',{word:'mat'})
meep('bed',{word:'bed'})

meep('_at') // => [{word:'bat'},{word:'sat'},{word:'mat'}]
```

Instead of filtering through a large list, I store the data in a tree structure. For the dataset in the previous example it would look something like this
``` js
{
  b:{
    a:{ t:{word:'bat'} },
    e:{
      n:{word:'ben'},
      d:{word:'bed'},
    },
  },
  s:{ a:{ t:{word:'sat'}}},
  m:{ a:{ t:{word:'mat'}}}
}
```
And then uses a list of iterators which gets spread for every don't care. So definitly not efficient for small data sets, but maybe better for certain types of data. At least I hope.

## Methods

**meep**`(key <iterable>, [value])` Get/Set values in the map

_meep._**null**`( [value] )` Get/Set the null value (useful for when using string keys)

_meep._**var**`(key, [value])` Get/Set a filter function interpretation for a certain value

## Basic Usage
``` js
const Meep = require('meep')
const meep = Meep().null('_')

meep('000',0)
meep('100',1)
meep('010',2)
meep('110',3)
meep('001',4)
meep('101',5)
meep('011',6)
meep('111',7)

/* All of these return the same thing cause they all specify the value for '1' to be '0' and the other values are left undefined */
meep('_0_') // => [0,1,4,5]
meep([,0,]) // => [0,1,4,5]
meep({1:0}) // => [0,1,4,5]

/* If nothing specified then returns everything */
meep('') // => [0,1,2,3,4,5,6,7]

/* Can also set multiple values at the same time, so be careful */
meep('','MEEP!') // Overwrites all the data
meep('') // => ['MEEP!','MEEP!','MEEP!','MEEP!','MEEP!','MEEP!','MEEP!','MEEP!']
```
## Filters
``` js
const Meep = require('meep')
const meep = Meep()

meep({color:'white',shape:'circle',size:0},'⚪️')
meep({color:'red',shape:'circle',size:1},'🔴')
meep({color:'blue',shape:'circle',size:1},'🔵')
meep({color:'black',shape:'circle',size:0},'⚫️')
meep({color:'orange',shape:'diamond',size:1},'🔶')
meep({color:'blue',shape:'diamond',size:2},'🔷')
meep({color:'blue',shape:'diamond',size:0},'🔹')
meep({color:'black',shape:'square',size:2},'⬛️')
meep({color:'black',shape:'square',size:1},'◼️')
meep({color:'black',shape:'square',size:0},'▪️')

/* Basic Usage */
meep({color:'black',shape:'square'}) // => ['⬛️','◼️','▪️']

/* If a value as set as a function, it will be used as a filter function */
meep({ 
  // colors that start with 'b'
  color:function(n){ return n[0] == 'b'}, 
  
  // sizes greater or equal to 1
  size:function(n){ return n >= 1 }, 
})
// => [ '🔵', '🔷', '⬛️', '◼️' ]

/* Can also set values to be interprutated as filter functions */
meep.var('warm',n => n=="red"||n=="orange")
meep.var('sharp',n => n=="diamond"||n=="square")

meep({color:'warm'}) // => [ '🔴', '🔶' ]
meep({shape:'sharp'}) // => [ '🔷', '🔹', '⬛️', '◼️', '▪️', '🔶' ]
meep({color:'warm',shape:'sharp'}) // => [ '🔶' ]
```