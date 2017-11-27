require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

var imgDatas=require('../data/imageData.json');

imgDatas=(function(imgDataArr){
	imgDataArr.forEach(function(value,index){
		value.imgURL=require("../images/"+value.fileName);
	})
	return imgDataArr;
})(imgDatas);

function genRandomNum(low,high){
	return Math.floor(low+Math.random()*(high-low));
}
/*
 获取0-30度之间的一个任意正负值

*/
function get30DegRandom(){
	return ((Math.random()>0.5?'':'-')+Math.ceil(Math.random()*30));

}
class ControllerUnit extends React.Component{
	handleClick(e){
		e.preventDefault();
		e.stopPropagation();
		if(this.props.arrange.isCenter){
		this.props.inverse();
		}
		else{
			this.props.center();
		}

	}
	render(){
		var controllerUnitClassName="controller-unit";
		//如果对应的是居中的图片，显示控制按钮的居中态
		if(this.props.arrange.isCenter){
			controllerUnitClassName+=" is-center";
			//如果同时对应的是翻转图片，显示控制按钮的翻转态
			if(this.props.arrange.isInverse){
				controllerUnitClassName+=" is-inverse";
			}
		}
		return(
			<span className={controllerUnitClassName} onClick={this.handleClick.bind(this)}></span>
			)
	}
}
class  ImgFigure extends React.Component{
	
	constructor(props){
		super(props);
		this.handleClick=this.handleClick.bind(this);
		this.style={};
	}
	/*
		ImgFigure的点击处理函数

	*/
	handleClick(e){
		e.stopPropagation();
		e.preventDefault();
		if(this.props.arrange.isCenter){
		this.props.inverse();
		}
		else{
			this.props.center();
		}
	}
	componentDidMount(){
		var imgDOM=ReactDOM.findDOMNode(this.refs.img);
	}
	render(){
		var styleObj={};
		if(this.props.arrange.pos){
			styleObj=this.props.arrange.pos;
		}
		var imgFigureClassName="imgFigure" ;
		    imgFigureClassName+=this.props.arrange.isInverse?' is-inverse':'';
		//如果图片的旋转角度有值并且不为0，添加旋转角度
		if(this.props.arrange.rotate){
			
            
			(['MozTransform','msTransform','WebkitTransform','transform']).forEach(function(value,index){
				styleObj[value]=' rotate('+this.props.arrange.rotate+'deg)';
			}.bind(this));
		}
		if(this.props.arrange.isCenter){
			styleObj.zIndex="500";
		}
		
		    

		return(
			<figure className={imgFigureClassName} style={styleObj} onClick={ this.handleClick} ref="img">
				<img src={this.props.data.imgURL}/>
				<figcaption >
				   <h2 className="img-title" >{this.props.data.title}</h2>
				   <div className="img-back" onClick={this.handleClick}>
				   		<p>
				   			{this.props.data.desc}
				   		</p>
				   </div>
				</figcaption>
			</figure>
			)
	}
}

class GalleryAppByReact extends React.Component {
  constructor(props){
	  	super(props);
	  	this.Constant={
	  		centerPos:{
	  			left:0,
	  			top:0
	  		},
	  		hPosRange:{
	  			leftSecX:[0,0],
	  			rightSecX:[0,0],
	  			y:[0,0]
	  		},
	  		vPosRange:{
	  			topY:[0,0],
	  			x:[0,0]
	  		}
	  	};
	  	this.state={
	  		imgsArrangeArr:[]
	  		/*
				//样式为
				pos:{
					top:0,
					left:0
				},
				rotate:0,//旋转角度
			    isInverse:false,  //图片正反面
			    isCenter:false

	  		*/
	  	}
  }
  /*
	 翻转图片
	 @param index 输入当前被执行inverse操作的图片对应的图片信息数组的index值。
	 @return {Function} 这是一个闭包函数，其内return一个真正待被执行的函数。

  */
  inverse(index){
  	return function(){
  		var imgsArrangeArr=this.state.imgsArrangeArr;
  		imgsArrangeArr[index].isInverse=!imgsArrangeArr[index].isInverse;

  		this.setState({
  			imgsArrangeArr:imgsArrangeArr
  		})
  		console.log('imgsArrangeArr',imgsArrangeArr);
  	}.bind(this);
  }
  center(centerIndex){
  	return function(){
  		this.rearrange(centerIndex);
  	}.bind(this);
  }
  rearrange(centerIndex){
  	var imgsArrangeArr=this.state.imgsArrangeArr,
  		topArrangeArr=[],
  		topImgNum=Math.floor(Math.random()*2), //舞台上部分的图片数量
  		Constant=this.Constant,
  		centerPos=Constant.centerPos,
  		hPosRange=Constant.hPosRange,
  		vPosRange=Constant.vPosRange,
  		hPosLeftSecX=hPosRange.leftSecX,
  		hPosRightSecX=hPosRange.rightSecX,
  		hPosY=hPosRange.y,
  		vPosTopY=vPosRange.topY,
  		vPosX=vPosRange.x,
  		hPosLORSecX=null;

	  	var centerImg=imgsArrangeArr.splice(centerIndex,1);
	  	//首先居中centerIndex的图片
	  	centerImg[0]={pos:{
	  		left:centerPos.left,
	  		top:centerPos.top,
	  		},
	  		isCenter:true,
	  		rotate:0  //居中的centerIndex的图片不需要旋转
			};
	  	
	  	
	  	var topImgIndex=Math.floor(Math.random()*(imgsArrangeArr.length-topImgNum));
	  	topArrangeArr=imgsArrangeArr.splice(topImgIndex,topImgNum);
	  	topArrangeArr.forEach(function(value,index){
	  		topArrangeArr[index]={
	  			pos:{
	  			top:genRandomNum(vPosTopY[0],vPosTopY[1]),
	  			left:genRandomNum(vPosX[0],vPosX[1]),
	  			},
	  			isCenter:false,
	  		    rotate:get30DegRandom()

	  	}
	  	});
	  	//为分布在左右两部分的图片随机分配位置
	  	for(var i=0,j=imgsArrangeArr.length,k=j/2;i<j;i++){
	  		if(i<k){
	  			hPosLORSecX=hPosLeftSecX;	
	  		}
	  		else{
	  			hPosLORSecX=hPosRightSecX;
	  		}
	  		imgsArrangeArr[i]={
	  			pos:{
		  			top:genRandomNum(hPosY[0],hPosY[1]),
		  			left:genRandomNum(hPosLORSecX[0],hPosLORSecX[1])
	  		    },
	  		    rotate:get30DegRandom(),
	  		    isCenter:false
				}
	  	}

	  	//把上部分的图片插入回数组
	  	if(topArrangeArr&&topArrangeArr[0]){
	  		imgsArrangeArr.splice(topImgIndex,0,topArrangeArr[0]);
	  	}
	  	//把中间的图片插回数组
	  	imgsArrangeArr.splice(centerIndex,0,centerImg[0]);
	  	//重置位置状态
	  	this.setState({imgsArrangeArr:imgsArrangeArr});



  }
  componentDidMount(){
  	 var stageDOM=ReactDOM.findDOMNode(this.refs.stage),
  	     stageW=stageDOM.scrollWidth,
  	     stageH=stageDOM.scrollHeight,
  	     halfStageW=stageW/2,
  	     halfStageH=stageH/2,
  	     figureDOM=ReactDOM.findDOMNode(this.refs.imgFigure),
  	     figureW=figureDOM.scrollWidth,
  	     figureH=figureDOM.scrollHeight,
  	     halfFigureW=figureW/2,
  	     halfFigureH=figureH/2;
  	this.Constant.centerPos={
  		left:halfStageW-halfFigureW,
  		top:halfStageH-halfFigureH
  	};
  	//确定左半部分的图片位置范围
  	this.Constant.hPosRange.leftSecX[0]=-halfFigureW;
  	this.Constant.hPosRange.leftSecX[1]=halfStageW-3*halfFigureW;
  	this.Constant.hPosRange.y[0]=-halfFigureH;
  	this.Constant.hPosRange.y[1]=stageH-halfFigureH;
  	//确定右半部分的图片位置范围
  	this.Constant.hPosRange.rightSecX[0]=halfStageW+halfFigureW;
  	this.Constant.hPosRange.rightSecX[1]=stageW-halfFigureW;
    //确定上部分的图片位置范围
    this.Constant.vPosRange.topY[0]=-halfFigureH;
    this.Constant.vPosRange.topY[1]=halfStageH-3*halfFigureH;
    this.Constant.vPosRange.x[0]=halfStageW-figureW;
    this.Constant.vPosRange.x[1]=halfStageW;

    this.rearrange(0);





  }
  render() {
  	var imgFigures=[];
  	var controllerUnits=[];
  	imgDatas.forEach(function(value,index){
  		if(!this.state.imgsArrangeArr[index]){
  			this.state.imgsArrangeArr[index]={
  				pos:{
  					left:0,
  					top:0
  				},
  				rotate:0,
  				isInverse:false,
  				isCenter:false
  			}
  		}
  		imgFigures.push(<ImgFigure  key={index} data={ value} ref="imgFigure" arrange={ this.state.imgsArrangeArr[index] }
  			inverse={this.inverse(index) }center={ this.center(index)}
  			/>);
  		controllerUnits.push(<ControllerUnit  key={index} arrange={this.state.imgsArrangeArr[index]}
  		inverse={this.inverse(index)} center={this.center(index)}/>);
  	}.bind(this));
    return (

    	<section className="stage" ref="stage">
    		<section className="img_sec">
    			{imgFigures}
    		</section>
    		<nav className="controller-nav">
				{controllerUnits}
    		</nav>
    	</section>
      
    );
  }
}

GalleryAppByReact.defaultProps = {
};

export default GalleryAppByReact;
