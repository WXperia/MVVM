function MVVM (options){
    this.$options = options
    var data = this._data = this.$options.data
    observe(data)
    for(var key in data){
        Object.defineProperty(this,key,{
            enumerable: true,
            get(){
                return this._data[key]
            },
            set(newVal){
                this._data[key] = newVal
            }
        })
    }
}
function isPlainObject (val){
    return typeof val !== 'undefined' && Object.prototype.toString.call(val) === '[object Object]'
}
function Observe(data){
    Object.keys(data).forEach(key=>{  
        let val = data[key]
        observe(val)
        Object.defineProperty(data,key,{
            enumerable: true,
            configurable: true,
            get(){
                return val
            },
            set(newVal){
                if(val === newVal){
                    return 
                }
                observe(newVal)
                val = newVal
            }
        })
    })
}

function observe(data){
    return new Observe(data)
}