// 文件引用 requier 按照文件引用的顺序打包  文件依赖
// require('./style.less')
// https://www.codercto.com/a/18867.html [***模块知识参考***]
// wq: 这种采用require的方式进行模块管理 node.js就是采用这种管理的, 现在除了微信游戏这块可能还在使用这种导模块方式，其他都都采用es6的方式
require('./styles/normalize');  //通用的ressa
require('./styles/index');
import { Local } from 'utils/storage.js';

import {useArray, arrFn} from './useApi/useArray';
import {numberFn} from './useApi/useNumber';
import {dateFn} from './useApi/useDate';
import {Ajax, FetchHttp} from './useApi/useHttp';

// console.log(Ajax, "Ajax");


// Module 的语法test
import {newHash as newHashLast, newHash1,PromiseObj} from './syntax-test/module';
import _, {obj, arr, newObj} from "./syntax-test/promise";
import *  as promiseAll from './syntax-test/promise';
// import {hash1} from './syntax-test/module';
// console.log(hash1,"fn")
// console.log(PromiseObj,"PromiseObj")
// console.log(_,"fn");
// console.log(obj,"obj");
// console.log(arr,"arr");
// console.log(newObj,"newObj");
// console.log(promiseAll,"promiseAll")


import {promise} from './useApi/usePromise';
// console.log(promise,"promise")



{
	// console.log('%s', Array.from('\u767d\u8272\u7684\u6d77'));
	// console.log(Array.from('\u767d\u8272\u7684\u6d77'));
}


