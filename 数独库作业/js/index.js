function clc() {
    for (let i = 0; i < 81; i++) {
        document.getElementsByTagName("input")[i].value = "";
        document.getElementsByTagName("input")[i].style.color = '#00d3ff';
    }
    alert("已清理所有单元格");
}

//点击显示答案按钮
function get_answer() {
    let bool = check_input();
    if (bool) {
        let grid = readAPuzzle();
        if (!isValidGrid(grid)) {
            alert("输入无效，请重试！(可能误输重复数字)");
        } else {
            if (search(grid)) {
                output_ans();
            } else {
                alert("无解，换个数测试吧");
            }
        }
    }
}

//检查输入的值
function check_input() {
    let arr = new Array();

    for (let i = 0; i < 81; i++) {
        arr[i] = Number(document.getElementsByTagName("input")[i].value);
        if (isNaN(arr[i])) {
            alert('请输入1-9之间的数字');
            return false
        }
    }

    if (arr.every(function isZero(x) {
            return x == 0
        })) {
        alert('没有输入，请重新输入！');
        return false
    }

    return true
}

//读取输入的值
function readAPuzzle() {
    let arr = new Array();

    for (let i = 0; i < 81; i++) {
        arr[i] = Number(document.getElementsByTagName("input")[i].value);
    }

    let grid = new Array();
    for (let i = 0; i < 9; i++) {
        grid[i] = new Array();
        for (let j = 0; j < 9; j++) {
            grid[i][j] = 0;
        }
    }


    for (let i = 0; i < 81; i++) {
        grid[Math.floor(i / 9)][i % 9] = arr[i];
    }

    return grid
}

//读取已经输入的格子
function getFreeCellList(grid) {
    let freeCellList = new Array();
    let index = 0

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (grid[i][j] == 0) {
                freeCellList[index] = new Array(i, j);
                index++;
            }
        }
    }

    return freeCellList
}

//检查输入的格子是否有用
function isValid(i, j, grid) {
    //检查行
    for (var column = 0; column < 9; column++) {
        if ((column != j) && (grid[i][column] == grid[i][j])) {
            return false
        }
    }

    //检查列
    for (var row = 0; row < 9; row++) {
        if ((row != i) && (grid[row][j] == grid[i][j])) {
            return false
        }
    }

    //以3x3的方式检查行列是否有效
    for (var row = Math.floor(i / 3) * 3; row < Math.floor(i / 3) * 3 + 3; row++) {
        for (var col = Math.floor(j / 3) * 3; col < Math.floor(j / 3) * 3 + 3; col++) {
            if ((row != i) && (col != j) && (grid[row][col] == grid[i][j])) {
                return false
            }
        }
    }

    return true //在格子里返回有效值
}

//检查固定值是否有效
function isValidGrid(grid) {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if ((grid[i][j] < 0) || (grid[i][j] > 9) || ((grid[i][j] != 0) && (!isValid(i, j, grid)))) {
                return false
            }
        }
    }
    return true
}


//开始进行数独解题
function search(grid) {
    var freeCellList = getFreeCellList(grid);
    var numberOfFreeCells = freeCellList.length;
    if (numberOfFreeCells == 0) {
        return true
    }

    var k = 0; //从第一个空闲格子开始遍历

    while (true) {
        var i = freeCellList[k][0];
        var j = freeCellList[k][1];
        if (grid[i][j] == 0) {
            grid[i][j] = 1;
        }

        if (isValid(i, j, grid)) {
            if (k + 1 == numberOfFreeCells) {
                //直到不再有可用单元格
                return true //解决
            } else {
                //移动到下一个格子
                k++;
            }
        } else {
            if (grid[i][j] < 9) {
                //用下一个可能的值填充空闲格子
                grid[i][j]++;
            } else {
                //开始回溯
                while (grid[i][j] == 9) {
                    if (k == 0) {
                        return false //没有可用的值
                    }
                    grid[i][j] = 0; //重置
                    k--; //回溯到前面的空闲格子
                    i = freeCellList[k][0];
                    j = freeCellList[k][1];

                }
                //用下一个可能的值填充空闲格子
                //继续开始搜索
                grid[i][j]++;
            }
        }
    }

    return true //解题完成
}


//输出答案
function output_ans() {
    var grid = readAPuzzle();
    var grid_original = readAPuzzle();

    if (search(grid)) {
        for (var i = 0; i < 81; i++) {
            if (grid[Math.floor(i / 9)][i % 9] != grid_original[Math.floor(i / 9)][i % 9]) {
                document.getElementsByTagName("input")[i].value = grid[Math.floor(i / 9)][i % 9];
                document.getElementsByTagName("input")[i].style.color = '#2DFF97';
            }
        }
    }

}