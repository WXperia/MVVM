// let obj = {}

// Object.defineProperty(obj,'school',{
//     // value:'val1',
//      //是否能被删除
//     configurable: true,
//     //是否能被修改 不能与 get和set同时存在
//     // writable: true , 
//     //可枚举
//     enumerable: true,
//     get(){
//         return 'aaa'
//     },
//     set(val){
//         console.log(val)
//     }
// })
// obj.school = 1
// console.log(obj.school)

let arr = [1,2,2,3,4,4,5,'d','d','aa','aa']

let keys = {}

for(let i=0;i<arr.length;i++){
    keys[arr[i]] = ''
}
    keys = Object.keys(keys)
console.log(keys)