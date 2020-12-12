在github上读的话开“blame"模式 “批改”？不然因为排版阅读体验会很糟糕
// 写在前面
今天已经是接到任务的第四天了，才开始写这个记录，主要是因为前三天甚至都说不上是摸着石头过河，基本上就是从0到1的一个阶段（如果最终目标是10000）
前几天了解了以下几个问题：什么是石头，什么是河，今天开始算是要摸着石头过河了，所以要做些标记
。。。说到做标记 那这岂不是BFS？只能说细思极恐，不如不思，走一步看一步
也算是进行一下支线任务
我正站在愚昧之山上看着眼前的下坡路www，意识到这点多少算是打个预防针吧，要落入bug之海了。

// 小结
总结下何为石头何为河吧
Chrome不允许调用同一个文件夹里的材质图片，离谱
用servez开本地服务器解决了这个问题
首先写一个HTML的壳用来开网页，然后import需要的源文件
    three.js
    （其他用得到的）.js
    自己写的main.js，画什么，怎么画，全都在这里决定
    websettings.css我不会css，只能用默认的，以后如果特别需要改网页的设置就通过这个
HTML文件里面要加一个division，用来承载webgl画出来的结果
还要调用几个函数，只调用和绘制渲染相关的就可以了，main.js里面可以定义别的函数自个儿用
Threejs主要是三个方面，scene，renderer，camera。我喜欢把这个可视化过程理解为画画，三个要素：画布，画笔，眼睛
当然还有物体，但是没有物体可以作画，没有画布是真的不行。
所以在main.js里面首先摆好画布（scene），拿出画笔（renderer），睁开眼睛（camera）
把物体制作好，放上去，找到观测角度，开始渲染，好耶！
这个项目最大的难点就是制作物体这个环节了
可以说前面几天把怎么画，怎么看等等问题基本解决了之后
可以预见接下来的时间和努力几乎全部都是用来学习“画什么”

// 2020.11.26 --停止做错误的事情是最正确的选择--
今天把atom的画法从sphere改成了point，它们各有长短，记录在下面：
    sphere是实际的物体，point是像素方块加上材质贴图
    每一个特定的sphere画起来都很方便，但是很难把它们按照规定的空间位置组合到一起
    相比之下point在定义的时候就可以用矩阵定义位置，然后再组合成分子，同理用矩阵表达的顶点也可以画出键
    和上一条相对的，如果sphere定位的问题被解决了，sphere在动态表达上会有很不错的表现，比如模拟化学反应中原子的移动和重组
    sphere吃资源，但是我也不知道具体吃多少，我也不知道单纯可视化的环节可以用多少资源
    网络上能找到的大部分资料都是用point来表示分子系统的，用point写方便参考改进（抄）
以后再想到/遇到相关的就加在上面
因为后期还要接收后端的数据，现在只能说麻雀虽小，五脏俱全
哪怕只是画一个原子，一个分子，也要当成是用传进来的数据，通过反复调用函数来实现
画出一个分子并且放在合适的位置上需要下列步骤：
    做原子
    把原子正确的组合成分子（调用做原子）
    把分子放在正确的位置上（调用组合分子）
    在画布上把分子画出来（调用摆放分子）
以上四步里面，想出每一步都需要什么parameter简直要命
其中画原子和最后画出来比较简单，原子怎么画我说了算，想画啥样画啥样，最后在屏幕上显示出来也是一行搞定
目前想到的组合分子有两种模式，第一种就是对于一些比较简单的分子，直接把原子的位置写进程序里，直接拿来用
如果写好的部分里没有这个分子，那就要用公式来计算原子的位置
有个很恐怖的事情，每个分子到底在哪个位置也不是我决定的，而是计算出来的。。。
目前想不到怎么实现这点，后面试试group吧，这也太多层套娃了。。。
哦还有，如果分子的结构和分子的位置不能用矩阵来表示的话，那我当场死亡
其实可以做出来玩的功能还有很多，比如加个GUI，可以开灯关灯玩儿（蛋疼）
硬核一点的话就开始弄中间层数据结构和转化。高内聚，低耦合
最幸福的展开是能在2021年之前用五个甲烷画出一个套娃甲烷，那真的做梦都会笑

// 2020.11.27 --锲而不舍，金石可镂--
                |y           /
                |         /
                |      /
                |   /
                |/
--------------------------------------x
             /  |
          /     |
       /        |
    /           |
 /z             |
和xyz对应长宽高的表示不一样，这里的y轴对应高度
想到一个新的方法：
    定义结构 表示结构中所有的vertices
    在以上结构中放atoms
之前的版本在atom-sim01里
vector3可以接收持续生成的顶点，顶点生成完毕之后
structure.vertices.push()
先画一条原子组成的链条试试
The current idea becomes:
    in addtoscreen(), there will only be one function call per molecule
    let's name it addMole(moleid, atomid) for now
    addMole calls to two functions:
        defStructure(moleid) that returns the structural information
        several calls to placeAtoms(atomid), thus different atoms are in right position
    however, which atom goes where needs to be stored somewhere, that's yet to be considered
Im choking in this room, I need fresh air but fresh air is so damn cold
I cannot think

// 2020.11.28 --早起的虫儿被鸟吃--
改了下昨天的写法
atoms是分开创建的
defstructure直接调用不同原子画出来
啊哈？为啥不能分开画 我裂开
waaaaaaaaaaaaaat出了个非常搞笑的bug
又好气又好笑 想把10个分子按照红绿红绿这样画 怎么画出来又红又绿的十个玩意儿啊？
好吧 存储顶点的geometry必须是不同的 红色atom和绿色atom各需要一个geometry变量
ok 下一步 画一个平面上的三角形 三个原子
一个想法：
    loop一个三维的网格出来，根据structure决定画在哪
    也就是说即使画一个平面的三角形 也loop成百上千个可能的点
这好像有点糟糕
目前的写法：
    loop所有的原子，二位结构就两层，三维就三层loop
    每个if对应一种原子 给它们分别上色
no this is bad, BAD
要改成loop原子，画出第一个 然后挨个apply matrix
。。。说得好像我会一样
到时候我拿到的structure长啥样啊 裂开
先这样吧 记着要想办法计算出原子位置就行了
把GUI稍微弄一弄 然后给大佬们过目 弄点建议来
顺手把方形的texture背景给去掉了 material.alphaTest = 0.5

// 2020.11.29 --不知道说啥就给自己比个心吧❤--
美好的一天从读源码开始
妈耶 六万行？
就画了一个分子？虽然挺大的。。
算了 打扰了 完全看不懂
好 我需要一个tree（你tm什么都想要，又什么都不会）
node存两个东西 这个atom，这个atom连着谁和链接的角度
实现的时候真香链表。。。
今日git master更新
clone可以有效避免vertex数据被改动 用clone apply matrix会生成新的点
不用clone会把matrix加到原来的vertex上

// 2020.12.1 --final week--
THREE.Geometry.colors : Array
Array of vertex colors, matching number and order of vertices.

This is used by Points and Line and any classes derived from those such as LineSegments and various helpers. Meshes use Face3.vertexColors instead of this.

To signal an update in this array, Geometry.colorsNeedUpdate needs to be set to true.

// 2020.12.6 --deus ex machina--
parse input file
first element in line is atom, define its name and color
next three are matrix, store in float32array
vertex colors are uint8array with 3rd parameter set to true, which normalize the array
both hex and decimal works r, g, b
bond怎么画啊卧槽我人傻了
我怎么知道哪个和哪个之间有bond又是什么bond呢
先把inputfile相关弄出来
哦还有一个NERF算法要处理

// 2020.12.8 --JSON暂时滴神--
for(i = 0, i < allatoms, i++){
    for(j = 1, j < allatoms, j++){
        switch( _bond_type(i, j) ){
            case "ionic":
                geometry = i, j;
                material = ionic;
                bond = new THREE.LineSegment(geometry, material);
                break;
            default:
            // no bond between i, j
            break;
        }
    }
}

// 2020.12.9 --read, parse, store, use--
读取json然后parse怎么看着简单做起来这么难？
就离谱
首先我应该在html里面加上文件名
然后在js里面弄一个ajax call 这样就输入了整个json
然后再根据json分出三部分
atomlist，用来定义颜色
atomposition，定义位置
bondinfo，定义bond
array = typedArray.from(array)可以重新定义type

// 2020.12.10 --原来我是一只，酒醉的蝴蝶--
被朋友循环了一天的歌给洗脑了，一晚上没睡好
根据bondinfo是[atom1, atom2, bondtype]的结构 implemented draw_bond的部分
for(loop thru all bonds in bondInfo){
    switch(bondtype){
        case "bondtype":
            geometry = atom1~atom2; //这需要是个array of vector3
            material = bondtype;
            bond = new THREE.LineSegments(geometry, material);
    }
}
然后是一个helper 
atom1是这个分子里第x个原子, 在position的array里面就是x*3 + 1
x从0开始算，array

// 2020.12.11 --computers are stupid--
计算数据的地方会出问题我是万万没想到的
今天和bug相面一整天未果，裂开

// 2020.12.12 --和妹子打电话有助于改代码？--
bond的数据计算问题在早上和妹子打电话的时候突然就通了
Vector3.fromArray(atomPosition, start);
解决了上面helper的数据算不准的问题
让人怀疑我昨天都干了什么
添加了一些注释方便理解
在代码一开始的地方添加了个json格式的东西
因为还是不会read_file
input格式和这个越接近就越好改
差非常远就得重来
github issue里拿到一个格式 好耶 燃起来了
naisuuuuuuuuuuuuuuuuuuuuuuuu
起飞
这个0和1的问题必须讨论一下 草