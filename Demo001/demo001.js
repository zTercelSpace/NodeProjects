class TRect {

    // 构造函数
    constructor(x, y, w, h) {
        this.x  = x;
        this.y  = y;
        this.w  = w;
        this.h  = h;

        //this.shareValue = 1;
    }

    // 函数
    inRect(x, y) {
        if (this.x <= x && x <= (this.x + this.w) && this.y <= y && y <= (this.y + this.h)) {
            return true;
        }
        return false;
    }

    // 函数
    toString() {
        return `Rect: [x: ${this.x} y: ${this.y} cx: ${this.x + this.w} cy: ${this.y + this.w}]`
    }

    test() {
        console.log(TRect.print());
    }
}

// 访问对象中成员数据
TRect.prototype.outRect = function (x, y ) {
    if (this.x > x || x > (this.x + this.w) || this.y > y || y > (this.y + this.h)) {
        return true;
    }

    return false;
}

TRect.prototype.shareValue = 1000;


// 类
TRect.print = function() {
    return ('Hello, TRect: ' + TRect.value);
}

TRect.value = 100;

let rect1   = new TRect(10, 10, 100, 100);
console.log(rect1.toString());
console.log(rect1.inRect(50, 50));

let rect2   = new TRect(0, 0, 100, 100);
console.log(rect2.toString());
console.log(rect2.inRect(50, 50));

console.log(rect1.outRect(-1, -5));
console.log(rect2.outRect(-1, -5));

console.log("rect1.shareValue： " + rect1.shareValue);  // 先检测对象上是不是有此属性， 没有则访问类原型上
TRect.prototype.shareValue = 10;
console.log("rect2.shareValue： " + rect2.shareValue);

// 类可访问，对象不可
//console.log(rect1.value);
console.log(TRect.value);
console.log(TRect.print());

// 对象中函数类对象
rect2.test();