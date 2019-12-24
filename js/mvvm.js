function MVVM(options) {
    this.$options = options
    var data = this._data = this.$options.data
    observe(data)
    //实现mvvm.keyname 将data挂载到 MVVM的实例上，所有实例共享 
    //for循环如果使用var key读取的是最后一个key 需要使用let
    for (let key in data) {
        Object.defineProperty(this, key, {
            enumerable: true,
            get() {
                return this._data[key]
            },
            set(newVal) {
                this._data[key] = newVal
            }
        })
    }
    new Compile(options.el, this)
}
function Compile(el, mvvm) {
    //el 表示编译的范围
    mvvm.$el = document.querySelector(el)

    let fragment = document.createDocumentFragment();
    //将实际的节点放到内存中
    while (child = mvvm.$el.firstChild) {
        fragment.appendChild(child)
    }
    $replace(fragment)
    function $replace(fragment) {
        Array.from(fragment.childNodes).forEach(function (node) {
            let text = node.textContent;
            let reg = /\{\{(.*)\}\}/g
            let re = /\{\{(.*)\}\}/
            //https://www.w3school.com.cn/jsref/prop_node_nodetype.asp
            /* 
                1	Element	代表元素	Element, Text, Comment, ProcessingInstruction, CDATASection, EntityReference
                2	Attr	代表属性	Text, EntityReference
                3	Text	代表元素或属性中的文本内容。	None
                4	CDATASection	代表文档中的 CDATA 部分（不会由解析器解析的文本）。	None
                5	EntityReference	代表实体引用。	Element, ProcessingInstruction, Comment, Text, CDATASection, EntityReference
                6	Entity	代表实体。	Element, ProcessingInstruction, Comment, Text, CDATASection, EntityReference
                7	ProcessingInstruction	代表处理指令。	None
                8	Comment	代表注释。	None
                9	Document	代表整个文档（DOM 树的根节点）。	Element, ProcessingInstruction, Comment, DocumentType
                10	DocumentType	向为文档定义的实体提供接口	None
                11	DocumentFragment	代表轻量级的 Document 对象，能够容纳文档的某个部分	Element, ProcessingInstruction, Comment, Text, CDATASection, EntityReference
                12	Notation	代表 DTD 中声明的符号。	None
            */
            if (node.nodeType === 3 && reg.test(text)) {
                let arr = [];
                arr = text.match(reg).map(function (val) {
                    return val.match(re)[1]
                })
                console.log(arr)
                let content ;
                let contentList = []
                arr.forEach(function (key) {
                    let replaceData = key.split('.');
                    content = mvvm
                    replaceData.forEach(function (key) {
                        content = content[key]
                    })
                    contentList.push(content)
                    
                    //存储这次改变的值，并根据key进行匹配对应的content
                    text = text.replace('{{'+key+'}}', content)
                    //将值赋给虚拟节点
                    node.textContent = text
                })
            }
            if (node.childNodes) {
                $replace(node)
            }
        })
    }

    mvvm.$el.appendChild(fragment)
}
function isPlainObject(val) {
    return typeof val !== 'undefined' && Object.prototype.toString.call(val) === '[object Object]'
}
function Observe(data) {
    Object.keys(data).forEach(key => {
        let val = data[key]
        observe(val)
        Object.defineProperty(data, key, {
            enumerable: true,
            /* 
               获取值时调用的函数
           */
            get() {
                return val
            },
            /* 
                更改值时调用的函数
            */
            set(newVal) {
                if (newVal === val) {
                    return
                }
                val = newVal
                observe(newVal)
            }
        })
    })
}

function observe(data) {
    if (!isPlainObject(data)) return
    return new Observe(data)
}
 /* vue 特点能新增没有在data中注册的对
   象就是因为属性没有defineProperty
   设置的get和set方法 */
/*
    深度响应时因为每次赋予一新对象时，会给这个新对象增加数据劫持
*/
