import "bootstrap/dist/css/bootstrap.min.css";
import React, { Component } from "react";
import Customercartitems from './cartitems'
import axios from 'axios';

class customercart extends Component {
   
    state = {
        userOrders:[],
    }



  render() {
    return (
    <div className="container-xxl" style={{ backgroundColor: "white", marginTop: "10px", transform:"none" }}>
        <div className="card text-center" style={{transform:"none"}}>
          <div className="card-header shadow-sm" style={{transform:"none", fontWeight:"bold", fontSize:"1.1rem", backgroundColor: "#dddddd", color:"black", border:"none"}}>
            Your Shopping Cart
          </div>
        <div className="card-body" style={{ transform:"none",backgroundColor: "white", color:"white" }}>
        <div className='row'>
          {this.state.userOrders.map((orders) =>(
            

            <div key = {orders.id} className='col-sm-3' style={{marginBottom:"1.25rem", transform:"none"}}>
          <Customercartitems key = {orders.id} Total={orders.TotalAmount} Date = {orders.date} Status = {orders.Status} orderId = {orders.id} status = {orders.Status} orderNo = {orders.OrderNo}/>

             </div>   
          ))};
        </div>
     
  </div>
  <div className="card-footer text-muted" style={{backgroundColor:"white"}}>
    
  </div>
</div> 
      </div>
    );
  }


  async componentDidMount() {

  

    const tokenString = sessionStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    const token = {Token:userToken};
    let status  = "dsad";
    

    const {data} = await axios.get("http://localhost:5000/api/order/getorders/",{params: {token:userToken}});
   const maped = data.map(orders => {

        if (orders.Status == 1)
        {
          status = "Pending";
        }
        else
        {
          status = "Shipped";
        }
        return{
           id : orders._id,
           Status : orders.Status,
           TotalAmount: orders.TotalAmount,
           date: orders.date,
           Status: status,
           OrderNo: orders.orderNo


        }
    });

    this.setState({userOrders:maped});


    

  }


}

export default customercart;
