require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

//  获取图片相关数据
let imageDatas = require('../data/imageDatas.json');

//  将图片名信息转换成URL路径信息
imageDatas = (function genImageURL(imageDatasArr) {
  for (var i = 0, j = imageDatasArr.length; i < j; i++) {
    var singleImageData = imageDatasArr[i];
    singleImageData.imageURL = require('../images/' + singleImageData.fileName);
    imageDatasArr[i] = singleImageData;
  }
  return imageDatasArr;
})(imageDatas);

/*
 *  获取区间内的一个随机值
 */
function getRangeRandom(low, high) {
  return Math.ceil(Math.random() * (high - low) + low);
}

var ImgFigure = React.createClass({
  render: function () {
    return (
      <figure className="img-figure">
        <img src={this.props.data.imageURL}/>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
        </figcaption>
      </figure>
    )
  }
});

var AppComponent = React.createClass({

  Constant: {
    centerPos: {
      left: 0,
      right: 0
    },
    hPosRange: { // 水平方向取值范围
      leftSecX: [0, 0],
      rightSecX: [0, 0],
      y: [0, 0]
    },
    vPosRange: { //  垂直方向取值范围
      x: [0, 0],
      topY: [0, 0]
    }
  },

  /*
   *  重新布局所有图片
   *  @param centerIndex 指定居中排布哪个图片
   */
  rearrange: function (centerIndex) {
    var imgsArrangeArr = this.stage.imgsArrangeArr,
      Constant = this.Constant,
      centerPos = Constant.centerPos,
      hPosRange = Constant.hPosRange,
      vPosRange = Constant.vPosRange,
      hPosRangeLeftSecX = hPosRange.leftSecX,
      hPosRangeRightSecX = hPosRange.rightSecX,
      hPosRangeY = hPosRange.y,
      vPosRangeTopY = vPosRange.topY,
      vPosRangeX = vPosRange.x,

      imgsArrangeTopArr = [],
    //取一个以内图片放在顶部
      topImgNum = Math.ceil(Math.random() * 2),
      topImgSpliceIndex = 0,
      imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

    //  居中 centerIndex 的图片
    imgsArrangeCenterArr[0].pos = centerPos;

    //  取出要布局上侧图片的状态信息
    topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum))
    imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

    //  布局位于上侧的图片
    imgsArrangeTopArr.forEach(function (value, index) {
      imgsArrangeTopArr[index].pos = {
        top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
        left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
      }
    })
  },

  getInitialState: function () {
    return {
      imgsArrangeArr: [
        /*{
         pos: {
         left: '0',
         top: '0'
         }
         }*/
      ]
    };
  },

  // 组件加载以后，为每张图片计算位置
  componentDidMount: function () {
    //  取得舞台大小
    var stageDOM = react.findDOMNode(this.refs.stage),
      stageW = stageDOM.scrollWidth,
      stageH = stageDOM.scrollHeight,
      halfStageW = Math.ceil(stageW / 2),
      halfStageH = Math.ceil(stageH / 2);

    //  拿到一个imageFigure的大小
    var imageFigureDOM = react.findDOMNode(this.refs.imageFigure0),
      imgW = imageFigureDOM.scrollWidth,
      imgH = imageFigureDOM.scrollHeight,
      halfImgW = Math.ceil(imgW / 2),
      halfImgH = Math.ceil(imgH / 2)

    //  计算中心位置
    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    };

    //  计算左侧右侧区域图片排布位置的取值范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;

    //  计算上侧区域图片排布位置的取值范围
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;

    this.rearrange(0)

  },

  render: function () {

    var controllerUnits = [],
      imgFigures = [];
    //  初始化状态
    imageDatas.forEach(function (value, index) {
      if (!this.state.imgsArrangeArr[index]) {
        this.state.imgsArrangeArr[index] = {
          pos: {
            left: '0',
            top: '0'
          }
        }
      }
      imgFigures.push(<ImgFigure data={value} ref={"imageFigure" + index}/>);
    }.bind(this));

    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
});

AppComponent.defaultProps = {};

export default AppComponent;
