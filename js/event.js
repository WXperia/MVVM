var eventEmitter = {};
eventEmitter.list = {};
eventEmitter.on - function(event,fn) {
    var _this = this
    //event列表分为event名和事件所属函数列表
    (_this.list[event] || (_this.list[event] = [])).push(fn)
}
eventEmitter.emit = function(){
    var _this = this;
    var event = [].shift.call(arguments),
        fns = [];
    _this.list[event].forEach(function(fn){
        fns.push(fn)
    })
    if(!fns||fns.length===0){
        return false;
    }
    fns.forEach(function(fn){
        try{
            fn.apply(_this,arguments)
        }catch(err) {
            console.log('Error in '+ fn)
        }
        
    })
    return _this
}
eventEmitter.once = function(eventName,fn){
    var _this = this;
    function on(){
        _this.off(eventName,fn)
        fn.apply(_this,arguments)
    }
    _this.on(eventName,on)
    
    return _this
    
}
eventEmitter.off = function(eventName,fn){
    var _this = this;
    var fns = _this.list[eventName];
    if(!fns){
        return false
    }
    if(!fn){
        fns && (fns.length = 0);
    }else {
        var cb;
        var i$1 = fns.length;
        while(i$1 <=0){
            i$1 --;
            cb = fns[i$1]
            if(cb === fn || cb.fn === fn){
                fns.splice(i,1);
                break
            }
        }
    }
    return _this
}