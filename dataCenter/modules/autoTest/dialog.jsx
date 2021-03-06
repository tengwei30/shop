import React from 'react';
import Util from "../../core/tools/util.jsx";
import Css from "./autotest.css";

export default class AutoTestDialog extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            data:{
                describe:"",
                before:{
                    isBefore:"false",
                    beforeType:"get",
                    beforeUrl:"",
                    beforeData:null
                },
                items:[
                    {
                        url:"",
                        sendType:"get",
                        sendData:null,
                        itemDesc:""
                    }
                ]
            },
            show:this.props.show,
            id:this.props.id
        };
    }

    cancel(){
        this.props.cb(false);
    }

    componentWillReceiveProps(next){
        if(next.id && next.show){
            Util.fetchAjax("/api/at/getItems/"+next.id).then(d=>{
                if(d.data.length == 1){
                    this.setState({show:next.show,data: d.data[0].data,id:next.id});
                }
            })
        }else{
            var tmp = {
                describe:"",
                    before:{
                    isBefore:"false",
                        beforeType:"get",
                        beforeUrl:"",
                        beforeData:null
                },
                items:[
                    {
                        url:"",
                        sendType:"get",
                        sendData:null,
                        itemDesc:""
                    }
                ]
            }
            this.setState({show:next.show,data:tmp,id:""});
        }
    }

    save(){
        if(this.state.show && this.state.id){
            Util.fetchAjax("/api/at/edit/"+this.state.id,"post",this.state.data).then(d=>{
                if(!d.rc){
                    alert(d.data);
                }
                this.props.cb(true);
            })
        }else{
            Util.fetchAjax("/api/at/add","post",this.state.data).then(d=>{
                if(!d.rc){
                    alert(d.data);
                }
                this.props.cb(true);
            })
        }
    }

    addItems(){
        this.state.data.items.push({
            url:"",
            sendType:"get",
            sendData:null,
            itemDesc:""
        });
        this.setState({data:this.state.data});
    }

    reduce(item){
        this.state.data.items.removeItems([item]);
        this.setState({data:this.state.data});
    }

    changeInput(item,field,e){
        item[field] = e.target.value;
        this.setState({data:this.state.data});
    }

    render(){
        if(this.state.show){
            return (
                <div style={{display:this.state.show==true?"block":"none"}}>
                    <div className={Css.black}></div>
                    <div class="modal" style={{display:"block"}}>
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <button class="close" onClick={e=>{this.cancel();}}><span>&times;</span><span class="sr-only"></span></button>
                                    <h4 class="modal-title">维护数据</h4>
                                </div>

                                <div className={Css.overflowY + " modal-body"}>
                                    <form class="form-horizontal tableForm" role="form" >
                                        <div class="form-group">
                                            <label class="col-sm-3 control-label titleLang" >测试用例描述:</label>
                                            <div class="col-sm-8">
                                                <input type="text" class="form-control input-sm" value={this.state.data.describe} onChange={e=>{this.changeInput(this.state.data,"describe",e)}} />
                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <label class="col-sm-3 control-label titleLang" >是否需要注入数据:</label>
                                            <div class="col-sm-8">
                                                <input type="radio" class="input-sm" value="true" name="isBefore" checked={this.state.data.before.isBefore == "true"} onChange={e=>{this.changeInput(this.state.data.before,"isBefore",e);}}/>是
                                                <input type="radio" class="input-sm" value="false" name="isBefore" checked={this.state.data.before.isBefore == "false"} onChange={e=>{this.changeInput(this.state.data.before,"isBefore",e);}}/>否
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label class="col-sm-3 control-label titleLang" >请求URL:</label>
                                            <div class="col-sm-8">
                                                <input type="text" class="form-control input-sm" value={this.state.data.before.beforeUrl} onChange={e=>{this.changeInput(this.state.data.before,"beforeUrl",e);}}/>
                                            </div>
                                            <label class="col-sm-3 control-label titleLang" >请求方式:</label>
                                            <div class="col-sm-8">
                                                <input type="radio" class="input-sm" name="beforeType" value="get" checked={this.state.data.before.beforeType == "get"} onChange={e=>{this.changeInput(this.state.data.before,"beforeType",e);}}/>get
                                                <input type="radio" class="input-sm" name="beforeType" value="post" checked={this.state.data.before.beforeType == "post"} onChange={e=>{this.changeInput(this.state.data.before,"beforeType",e);}}/>post
                                            </div>
                                            <label class="col-sm-3 control-label titleLang" >参数data:</label>
                                            <div class="col-sm-8">
                                                <textarea value={this.state.data.before.beforeData} onChange={e=>{this.changeInput(this.state.data.before,"beforeData",e);}}></textarea>
                                            </div>
                                        </div>
                                        <h3 className={Css.inline}>单元测试数据</h3> <input class="btn btn-default btn-sm" type="button" value=" + " onClick={e=>{this.addItems();}} />

                                        {this.state.data.items.map(item =>{
                                            return (
                                                <div class="form-group">
                                                    <label class="col-sm-3 control-label titleLang" >描述:</label>
                                                    <div class="col-sm-8">
                                                        <input type="text" class="form-control input-sm" value={item.itemDesc} onChange={e=>{this.changeInput(item,"itemDesc",e);}}/>
                                                    </div>
                                                    <label class="col-sm-3 control-label titleLang" >请求URL:</label>
                                                    <div class="col-sm-8">
                                                        <input type="text" class="form-control input-sm" value={item.url} onChange={e=>{this.changeInput(item,"url",e);}}/>
                                                    </div>
                                                    <label class="col-sm-3 control-label titleLang" >请求方式:</label>
                                                    <div class="col-sm-8">
                                                        <input type="radio" class="input-sm" value="get" name={Math.ceil(Math.random()*1000000)} checked={item.sendType == "get"} onChange={e=>{this.changeInput(item,"sendType",e);}}/>get
                                                        <input type="radio" class="input-sm" value="post" name={Math.ceil(Math.random()*1000000)} checked={item.sendType == "post"} onChange={e=>{this.changeInput(item,"sendType",e);}}/>post
                                                    </div>
                                                    <label class="col-sm-3 control-label titleLang" >参数data:</label>
                                                    <input type="button" value=" - " class="btn btn-default btn-sm" onClick={e=>{this.reduce(item);}} />
                                                    <div class="col-sm-8">
                                                        <textarea value={item.sendData} onChange={e=>{this.changeInput(item,"sendData",e);}}></textarea>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </form>
                                </div>
                                <div class="modal-footer">
                                    <input type="button" class="btn btn-default" value="取消" onClick={e=>{this.cancel();}} />
                                    <input type="button" class="btn btn-primary" value="确定" onClick={e=>{this.save();}}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }else{
            return <div></div>;
        }
    }
}







