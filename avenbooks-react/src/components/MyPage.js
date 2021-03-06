import React, { Component } from 'react';
import axios from 'axios';
import { SELL_URL, BUY_URL, CONFIRM_URL } from "../constants";
import { withCookies, Cookies } from 'react-cookie';
import {Link} from 'react-router-dom';
import { Table, Header, Label, Button, Card, Image, Modal } from 'semantic-ui-react';
import course from '../static/images/course.png';

class MyPage extends Component {
  constructor(props) {
    super(props);
    this.state = {

      mySellingInfo: [],
      othersBuyingReq: [],
      myBuyingReq: [],

      /*
      mySellingInfo: [
        {
          SellingID: 1,
          BookID: 1,
          SellerID: 20160140,
          Price: 10000,
          Time: new Date('2018-05-26T00:49:00+09:00').toString(),
          Finished: false
        },
        {
          SellingID: 2,
          BookID: 2,
          SellerID: 20160140,
          Price: 15000,
          Time: new Date('2018-05-26T00:49:00+09:00').toString(),
          Finished: true
        },
      ],
      othersBuyingReq: [
        {
          SellingID: 1,
          BookID: 1,
          BookName: 'Introduction to DB',
          SellerName: 'Kim Yoonseo',
          BuyerName: 'Hong Youngkyu',
          SellerID: 20160140,
          Time: new Date('2018-05-26T00:49:00+09:00').toString(),
          BuyerID: 20160710,
          Finished: false
        },
        {
          SellingID: 1,
          BookID: 1,
          BookName: 'Introduction to DB',
          SellerName: 'Kim Yoonseo',
          BuyerName: 'Kang Hyunwoo',
          SellerID: 20160140,
          Time: new Date('2018-05-26T00:49:00+09:00').toString(),
          BuyerID: 20160022,
          Finished: false
        },
        {
          SellingID: 2,
          BookID: 2,
          BookName: 'Mano computer architecture',
          SellerName: 'Kim Yoonseo',
          BuyerName: 'Kang Hyunwoo',
          SellerID: 20160140,
          Time: new Date('2018-05-26T00:49:00+09:00').toString(),
          BuyerID: 20160022,
          Finished: false
        },
        {
          SellingID: 2,
          BookID: 2,
          BookName: 'Mano computer architecture',
          SellerName: 'Kim Yoonseo',
          BuyerName: 'Hong Youngkyu',
          SellerID: 20160140,
          Time: new Date('2018-05-26T00:49:00+09:00').toString(),
          BuyerID: 20160710,
          Finished: false
        },
      ],
      myBuyingReq: [
        {
          SellingID: 3,
          BookID: 3,
          BookName: 'Introduction to analysis',
          SellerName: 'Hong YoungKyu',
          BuyerName: 'Kim Yoonseo',
          SellerID: 20160710,
          Time: new Date('2018-05-26T00:49:00+09:00').toString(),
          BuyerID: 20160140,
          Price: 10000,
          Confirmed: false
        },
        {
          SellingID: 3,
          BookID: 3,
          BookName: 'Introduction to analysis',
          SellerName: 'Hong YoungKyu',
          BuyerName: 'Kim Yoonseo',
          SellerID: 20160710,
          Time: new Date('2018-05-26T00:49:00+09:00').toString(),
          BuyerID: 20160140,
          Price: 20000,
          Confirmed: false
        },
      ]
      */
    };

    this.getMySellingInfo = this.getMySellingInfo.bind(this);
    this.getOthersBuyingReq = this.getOthersBuyingReq.bind(this);
    this.getMyBuyingReq = this.getMyBuyingReq.bind(this);
  }

  /* Get my selling infomations */
  getMySellingInfo(studentID) {
    axios.get(SELL_URL, {
      params: {
        sellerID: studentID
      }
    }).then((res) => {
      this.setState({ mySellingInfo : res.data });
      console.log(res);
    }).catch((error) => {
      console.log(error);
    });
  }

  /* Get others buying requests to mine */
  getOthersBuyingReq(studentID) {
    axios.get(BUY_URL, {
      params: {
        sellerID: studentID
      }
    }).then((res) => {
      this.setState({ othersBuyingReq : res.data })
      console.log(res);
    }).catch((error) => {
      console.log(error);
    });
  }

  /* Get my buying request to others */
  getMyBuyingReq(studentID) {
    axios.get(BUY_URL, {
      params: {
        buyerID: studentID
      }
    }).then((res) => {
      this.setState({ myBuyingReq : res.data })
      console.log(res);
    }).catch((error) => {
      console.log(error);
    })
  }

  componentWillMount() {
    const { cookies } = this.props;
    const studentID = cookies.get('StudentID');
    console.log(studentID);
    this.getMySellingInfo(studentID);
    this.getOthersBuyingReq(studentID);
    this.getMyBuyingReq(studentID);
  }

  render() {
        const { cookies } = this.props;
        return (
        <div>
        <Card centered style={styles.cardStyle}>
          <Card.Content>
            <Card.Header>
              {cookies.get('Name')}
            </Card.Header>
            <Card.Meta>
              {cookies.get('StudentID')}
            </Card.Meta>
            <Card.Description>
              {cookies.get('PhoneNumber')}
            </Card.Description>
          </Card.Content>
        </Card>

        <Header
          as='h2'
          content="My Selling Informations"
        />
          <div style={styles.subStyle}></div>
          <Table collapsing celled style={styles.tableStyle}>
            <Table.Header>
              <Table.Row style={styles.rowStyle}>
                <Table.HeaderCell>BookName</Table.HeaderCell>
                <Table.HeaderCell>Price</Table.HeaderCell>
                <Table.HeaderCell>Uploaded Time</Table.HeaderCell>
                <Table.HeaderCell>Finished</Table.HeaderCell>
                <Table.HeaderCell></Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {this.state.mySellingInfo.map((info, i) => {
                let starttime = new Date(info.SellingTime);
                let fixedtime = new Date(starttime.getTime()-(starttime.getTimezoneOffset()*60000));

                const time = fixedtime.toISOString().slice(0, 19).replace('T', ' ');

                return (<MySellingInfo sellingID={info.SellingID}
                                       bookID={info.BookID}
                                       bookName={info.BookName}
                                       price={info.Price}
                                       time={time}
                                       finished={info.Finished}
                                       studentID={cookies.get('StudentID')}
                                       getMySellingInfo={this.getMySellingInfo}
                                       key={i}/>);
              })}
            </Table.Body>
          </Table>
          <div style={styles.subStyle}></div>

        <Header
          as='h2'
          content="Others Buying Requests"
        />
        <Table collapsing celled style={styles.tableStyle}>
          <Table.Header>
            <Table.Row style={styles.rowStyle}>
              <Table.HeaderCell>BookName</Table.HeaderCell>
              <Table.HeaderCell>BuyerID</Table.HeaderCell>
              <Table.HeaderCell>BuyerName</Table.HeaderCell>
              <Table.HeaderCell>Requested Time</Table.HeaderCell>
              <Table.HeaderCell>Confirmed</Table.HeaderCell>
              <Table.HeaderCell>Finished</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {this.state.othersBuyingReq.map((info, i) => {
              let starttime = new Date(info.TradeTime);
              let fixedtime = new Date(starttime.getTime()-(starttime.getTimezoneOffset()*60000));

              const time = fixedtime.toISOString().slice(0, 19).replace('T', ' ');
              return (<OthersBuyingReq bookName={info.BookName}
                                       sellerID={info.SellerID}
                                       sellingID={info.SellingID}
                                       buyerName={info.BuyerName}
                                       time={time}
                                       buyerID={info.BuyerID}
                                       confirmed={info.Confirmed}
                                       finished={info.Finished}
                                       studentID={cookies.get('StudentID')}
                                       getMySellingInfo={this.getMySellingInfo}
                                       getOthersBuyingReq={this.getOthersBuyingReq}
                                       key={i}/>);
            })}
          </Table.Body>
        </Table>

        <Header
          as='h2'
          content="My Buying Requests"
        />
        <Table collapsing celled style={styles.tableStyle}>
          <Table.Header>
            <Table.Row style={styles.rowStyle}>
              <Table.HeaderCell>BookName</Table.HeaderCell>
              <Table.HeaderCell>SellerID</Table.HeaderCell>
              <Table.HeaderCell>SellerName</Table.HeaderCell>
              <Table.HeaderCell>Price</Table.HeaderCell>
              <Table.HeaderCell>Requested Time</Table.HeaderCell>
              <Table.HeaderCell>Confirmed</Table.HeaderCell>
              <Table.HeaderCell>Finished</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {this.state.myBuyingReq.map((info, i) => {
              let starttime = new Date(info.TradeTime);
              let fixedtime = new Date(starttime.getTime()-(starttime.getTimezoneOffset()*60000));

              const time = fixedtime.toISOString().slice(0, 19).replace('T', ' ');
              return (<MyBuyingReq bookName={info.BookName}
                                   sellingID={info.SellingID}
                                   sellerID={info.SellerID}
                                   sellerName={info.SellerName}
                                   price={info.Price}
                                   time={time}
                                   confirmed={info.Confirmed}
                                   studentID={cookies.get('StudentID')}
                                   getMyBuyingReq={this.getMyBuyingReq}
                                   finished={info.Finished}
                                   key={i}/>);
            })}
          </Table.Body>
        </Table>
      </div>
    );
  }
}

class MySellingInfo extends React.Component {
  state = { open: false };

  show = () => {
    this.setState({ open: true });
  };

  /* Called when the modal when OK button */
  handleConfirm = () => {
    this.deleteSellingInfo(this.props.sellingID);
    this.setState({ open: false });
  };

  /* Called when the modal is closed without clicking confirm */
  handleCancel = () => {
    this.setState({ open: false });
  };

  /* Delete current selling info */
  deleteSellingInfo(sellingID) {
    axios.delete(SELL_URL + '/' + sellingID
      ).then((res) => {
        console.log(res);
        this.props.getMySellingInfo(this.props.studentID);
      }).catch((error) => {
        console.log(error);
    })
  }

  render() {
    return (
      <Table.Row
        disabled={this.props.finished}
        style={styles.rowStyle}
        positive={this.props.finished}>
        <Table.Cell>
          {this.props.bookName}
        </Table.Cell>
        <Table.Cell>
          {this.props.price}
        </Table.Cell>
        <Table.Cell>
          {this.props.time}
        </Table.Cell>
        <Table.Cell>
          {(this.props.finished) ? "Yes" : "No"}
        </Table.Cell>
        {this.props.finished ?
          (<Table.Cell>-</Table.Cell>) :
          (
            <Table.Cell>
              <Modal
                open={this.state.open}
                trigger={<Button secondary onClick={this.show}>Delete</Button>}
                onClose={this.handleCancel}
              >
                <Modal.Content>
                  Are you sure you want to delete your sell?
                </Modal.Content>
                <Modal.Actions>
                  <Button onClick={this.handleCancel}>No</Button>
                  <Button onClick={this.handleConfirm} color='teal' content='Yes' />
                </Modal.Actions>
              </Modal>
            </Table.Cell>
          )}
      </Table.Row>
    )
  }
}

class OthersBuyingReq extends React.Component {
  state = { open: false };

  show = () => {
    this.setState({ open: true });
  };

  /* Called when the modal when OK button in Confirm */
  handleConfirm = () => {
    console.log("confirm others buying req");
    this.confirmOthersBuyingReq(this.props.sellingID, this.props.buyerID);
    this.setState({ open: false });
  };

  /* Called when the modal is closed without clicking confirm */
  handleCancel = () => {
    this.setState({ open: false });
  };

  confirmOthersBuyingReq(sellingID, buyerID) {
    axios.put(CONFIRM_URL + '/' + sellingID + '/' + buyerID
    ).then((res) => {
      console.log(res);
      this.props.getMySellingInfo(this.props.studentID);
      this.props.getOthersBuyingReq(this.props.studentID);
    }).catch((error) => {
      console.log(error);
    });
  }

  render () {
    return (
      <Table.Row
        disabled={this.props.finished}
        style={styles.rowStyle}
        positive={this.props.finished & this.props.confirmed}
        negative={this.props.finished & (!this.props.confirmed)}
        >
        <Table.Cell>
          {this.props.bookName}
        </Table.Cell>
        <Table.Cell>
          {this.props.buyerID}
        </Table.Cell>
        <Table.Cell>
          {this.props.buyerName}
        </Table.Cell>
        <Table.Cell>
          {this.props.time}
        </Table.Cell>
        <Table.Cell>
          {(this.props.confirmed) ? "Yes" : "No"}
        </Table.Cell>
        <Table.Cell>
          {(this.props.finished) ? "Yes" : "No"}
        </Table.Cell>
        {this.props.finished ?
          (<Table.Cell>-</Table.Cell>) :
          (
            <Table.Cell>
              <Modal
                open={this.state.open}
                trigger={<Button color='teal' onClick={this.show}>Confirm</Button>}
                onClose={this.handleCancel}
              >
                <Modal.Content>
                  Are you sure you want to confirm this request?
                </Modal.Content>
                <Modal.Actions>
                  <Button onClick={this.handleCancel}>No</Button>
                  <Button onClick={this.handleConfirm} color='teal' content='Yes' />
                </Modal.Actions>
              </Modal>
            </Table.Cell>
          )}
      </Table.Row>
    )
  }
}

class MyBuyingReq extends React.Component {
  state = { open: false };

  show = () => {
    this.setState({ open: true });
  };

  /* Called when the modal when OK button in Confirm */
  handleDeleteConfirm = () => {
    console.log("delete my buying req");
    this.deleteMyBuyingReq(this.props.sellingID, this.props.studentID);
    this.setState({ open: false });
  };

  /* Called when the modal is closed without clicking confirm */
  handleCancel = () => {
    this.setState({ open: false });
  };

  deleteMyBuyingReq(sellingID, buyerID) {
    axios.delete(BUY_URL + '/' + sellingID + '/' + buyerID
    ).then((res) => {
      console.log(res);
      this.props.getMyBuyingReq(this.props.studentID);
    }).catch((error) => {
      console.log(error);
    })
  }

  render () {
    return (
      <Table.Row
        disabled={this.props.finished}
        style={styles.rowStyle}
        positive={this.props.finished & this.props.confirmed}
        negative={this.props.finished & (!this.props.confirmed)}
      >
        <Table.Cell>
          {this.props.bookName}
        </Table.Cell>
        <Table.Cell>
          {this.props.sellerID}
        </Table.Cell>
        <Table.Cell>
          {this.props.sellerName}
        </Table.Cell>
        <Table.Cell>
          {this.props.price}
        </Table.Cell>
        <Table.Cell>
          {this.props.time}
        </Table.Cell>
        <Table.Cell>
          {(this.props.confirmed) ? "Yes" : "No"}
        </Table.Cell>
        <Table.Cell>
          {(this.props.finished) ? "Yes" : "No"}
        </Table.Cell>
        {this.props.finished ?
          (<Table.Cell>-</Table.Cell>) :
          (
            <Table.Cell>
              <Modal
                open={this.state.open}
                trigger={<Button secondary onClick={this.show}>Delete</Button>}
                onClose={this.handleCancel}
              >
                <Modal.Content>
                  Are you sure you want to delete your request?
                </Modal.Content>
                <Modal.Actions>
                  <Button onClick={this.handleCancel}>No</Button>
                  <Button onClick={this.handleDeleteConfirm} color='teal' content='Yes' />
                </Modal.Actions>
              </Modal>
            </Table.Cell>
          )}
      </Table.Row>
    )
  }
}

const styles = {
  cardStyle: {
    marginTop: '2vh',
  },
  tableStyle: {
    margin: 'auto',
  },
  subStyle: {
    width: '15vw',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  rowStyle: {
    textAlign: "center"
  }
}

export default withCookies(MyPage);