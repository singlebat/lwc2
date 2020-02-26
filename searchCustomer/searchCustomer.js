import { LightningElement, track ,wire} from 'lwc';
import getContactList from '@salesforce/apex/searchCustomerController.getContactListbypara';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import { getObjectInfo,getPicklistValues } from 'lightning/uiObjectInfoApi';
import Gender_FIELD from '@salesforce/schema/Contact.FinServ__Gender__c';
import Contact_OBJECT from '@salesforce/schema/Contact';

export default class searchBasic extends NavigationMixin(LightningElement)  {
    @track gender = '男';
    @track status = 'status１';
    @track contacts;
    @track contactId;
    @track defaultRecordTypeId;
    @track 
    genders;
    @track Birth=null;
    @track HaveData = false;
    @track contactInfo;

    @wire(getObjectInfo, { objectApiName: Contact_OBJECT })
    setObjectInfo({error, data}) {
        if (data) {
            this.contactInfo = data.defaultRecordTypeId;
        } else if (error) {
            // ...
        }
    }
  

    @wire(getPicklistValues, { recordTypeId: '$contactInfo', fieldApiName: Gender_FIELD }) 
    setPicklistOptions({error, data}) {
        if (data) {
            this.genders = data.values;
        } else if(error) {
            alert(error);
        }
    }

    doClear(){
        this.name1 = null;
        this.name2 = null;
        this.gender = null;
        this.Birth = null;
        this.phone2 = null;
        this.email = null;
        this.adress = null;
        this.status = null;
        this.contacts = null;
        this.HaveData=false;
    }
    //@wire(getContactList,{seibetu: gender }) Contacts2;
    doSearch(){
        getContactList({
            gender: this.gender,
            Birthdate:this.Birth,
        })
        .then(result => {
            // set @track contacts variable with return contact list from server  
            this.contacts = result;
            this.HaveData=true;
        })
        .catch(error => {
            // display server exception in toast msg 
            const event = new ShowToastEvent({
                title: 'Error',
                variant: 'error',
                message: error.body.message,
            });
            this.dispatchEvent(event);
            // reset contacts var with null   
            this.contacts = null;
        });
    }

    /*get options() {
        return [
                    { label: '男', value: '男' },
                    { label: '女', value: '女' }
                ];
    }*/

    handleChange(event) {
        this.gender = event.detail.value;
    }

    get statusOp() {
        return [
                    { label: 'status１', value: 'status１' },
                    { label: 'status２', value: 'status２' }
                ];
    }

    statusChange(event) {
        this.status = event.detail.value;
    }
    BirthChange(event) {
        this.Birth = event.detail.value;
    }

    jumpto(event) {
        this.contactId = event.target.dataset.id;
        //alert( this.contactId);
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                objectApiName: 'contact',
                recordId:this.contactId,
                actionName: 'view',
            }
        });
    }
}