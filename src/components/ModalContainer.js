import React, { Component, createRef } from 'react'
import ProductFolder from '../pages/ProductFolder';
import cols from '../ColNames/Products/colNames';
import { Col, Row } from 'antd';
import '../pages/Page.css'
import { connect } from 'react-redux'
import ResponsiveTable from './ModalResponsiveTable';
import LoaderHOC from '../components/LoaderHOC';

import {
    CaretDownOutlined,
    CaretUpOutlined,
} from '@ant-design/icons';
var attributesNamesArray = []
class GridExampleContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cols: cols,
            attributes: this.props.attributes,
            showgroups: false

        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.attributes != this.props.attributes) {
            attributesNamesArray = []
            Object.values(nextProps.attributes).map(c => {
                attributesNamesArray.push({
                    dataField: 'col_' + c.Name,
                    text: c.Title,
                    sort: true,
                    hidden: false
                })
            })
            this.setState({
                attributes: attributesNamesArray
            })
        }
    }
    showGroups = () => {
        this.setState({
            showgroups: !this.state.showgroups
        })
    }
    render() {
        return (
            <Row className={'table_holder_section'}>
                <Col xs={24} md={12} xl={4}>
                    <p onClick={this.showGroups} className='show_groups' >Qrupları görsət   {this.state.showgroups ? <CaretUpOutlined /> : <CaretDownOutlined />}</p>
                    <div className={`groups_holder_for_mobile ${this.state.showgroups ? `show` : ``}`}>
                        <ProductFolder from={'products'} groups={this.props.groups} />
                    </div>
                </Col>
                <Col xs={24} md={12} xl={20}>
                    <ResponsiveTable cols={cols} attributes={attributesNamesArray} initialcols={cols.concat(attributesNamesArray)} columns={cols.concat(attributesNamesArray).filter(c => c.hidden == false)} redirectTo={'editProduct'} from={'products'} editPage={'editProduct'} foredit={'products'} />
                </Col>
            </Row>
        )
    }
}
const mapStateToProps = (state) => ({
    state
})
export default connect(mapStateToProps)(GridExampleContainer)
