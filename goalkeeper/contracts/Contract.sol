// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Accountablity {
    struct Task{
        string description;
        bool isCompleted;
    }
    Task []public tasks;   // The tasks array is used to store and manage a collection of Task created 
    address public owner;

    // the modifier onlyOwner is used to restrict the access to the function to the owner of the contract
    modifier onlyOwner(){
        require(msg.sender == owner, "You are not the owner");
        _;
    }
    constructor() {
        owner = msg.sender;
    }

    // now onlyOwner can create a task
    function createTask(string memory _description) public onlyOwner{
        tasks.push(Task(_description, false));
    }

    // function to add funds 
    function depositFunds() public payable onlyOwner{
        require(msg.value > 0, "You need to send some ether"); // making sure funds is not zero
    }

    function withdrawFunds() public onlyOwner{
        uint256 amount=address(this).balance; // get the balance of the contract
        require(amount>0, "There are no funds to withdraw"); // making sure there are funds to withdraw
        payable(owner).transfer(amount); // transfer the balance to the owner
    }

    // internal function to check if all tasks are completed
    function allTasksCompleted() private view returns(bool){
        for(uint256 i=0; i<tasks.length; i++){
            if(!tasks[i].isCompleted){
                return false;
            }
        }
        return true;
    }

    function clearTask() private{
        delete tasks;
    }

    // function to complete a task and transfer the funds to the owner if all tasks are completed
    function completeTask(uint256 _index) public onlyOwner{
        require(_index < tasks.length, "Invalid index");
        require(!tasks[_index].isCompleted, "Task is already completed"); // making sure the task is not already completed

        tasks[_index].isCompleted = true; // mark the task as completed
        if(allTasksCompleted()){
            uint256 amount=address(this).balance; // get the balance of the contract
            payable(owner).transfer(amount); // transfer the balance to the owner
            clearTask();
        }
    }

    function getTasksCount() public view returns(uint256){
        return tasks.length;
    }

    function getBalance() public view returns(uint256){
        return address(this).balance;
    }

    function getTasks() public view returns(Task[] memory){
        return tasks;
    }
}

// 0x8deBb06B80d688DC75F2417c4dD76545fbdfdbCe