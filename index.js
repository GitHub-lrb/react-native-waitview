/**
 * Created by robin on 2017/3/16.
 */


import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    ActivityIndicator,
    DeviceEventEmitter
} from 'react-native';
import Modal from  'react-native-modalbox'
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    background: {
        width: 200,
        height: 120,
        borderRadius:10,
        alignItems: 'center'
    },
    title:{
        color:'white',
        marginBottom:20
    },
    modal: {
        height: 120,
        width: 200,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius:10
    }
});

const SIZES = ['small', 'normal', 'large'];

export default class WaitView extends React.Component {

    state = {showTitle:''}
    showedCallBack = undefined;
    closedCallBack = undefined;
    isShow = false;
    show = (title,callback)=>{

        if (title != undefined && title != null && title.length > 0){
            this.setState({
                showTitle: title
            })
        }
        else{
            this.setState({
                showTitle: this.props.title
            })
        }
        this.isShow = true;
        this.showedCallBack = callback;
        this.refs.modal.open();

        this.eventHandle = DeviceEventEmitter.addListener('hiddenWaitView',this.hidden);
    };

    hidden = (callback)=>{
        if(!this.isShow){
            callback();
        }
        else{
            this.isShow = false;
            this.closedCallBack = callback;

            this.refs.modal.close();
            this.eventHandle.remove();
        }
    };

    _isShow = ()=>{
        return this.isShow;
    };

    freshTitle = (title)=>{
        this.setState({showTitle:title});
    };

    static propTypes = {
        color: React.PropTypes.string,
        size: React.PropTypes.oneOf(SIZES),
        overlayColor: React.PropTypes.string,
        title: React.PropTypes.string,
        interval:React.PropTypes.number
    };

    static defaultProps = {
        color: 'white',
        size: 'large', // 'normal',
        overlayColor: 'rgba(0, 0, 0, 1)',
        title:'正在加载',
        interval:30000
    };



    _renderSpinner() {

        const spinner = (
            <View style={styles.container} key={`spinner_${Date.now()}`}>

            </View>
        );

        return (
            <Modal style={styles.modal} position={"center"} ref="modal" isDisabled={false}
                   backdropPressToClose = {false}
                   openAnimationDuration = {0}
                   swipeToClose = {false}
                   onClosed = {this.onClosed} onOpened = {this.onOpened}>
                <View
                    style={[styles.background,{ backgroundColor: this.props.overlayColor }]}>
                    <ActivityIndicator
                        color={this.props.color}
                        size={this.props.size}
                        style={{ flex: 1 }}
                    />
                    <Text style={styles.title}>{this.state.showTitle}</Text>
                </View>
            </Modal>

        );
    }

    render() {
        return this._renderSpinner();
    }

    onOpened = ()=>{
        if (this.showedCallBack !=undefined){
            this.showedCallBack();
        }
    };

    onClosed = ()=>{
        if (this.closedCallBack != undefined){
            this.closedCallBack();
        }

    };
}
