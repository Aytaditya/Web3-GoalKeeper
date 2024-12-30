'use client';

import React, { useEffect, useState } from 'react';
import { TransactionButton, useActiveAccount, useReadContract } from 'thirdweb/react';
import { prepareContractCall, toEther, toWei } from 'thirdweb';
import StaticCont from './StaticCont';
import { contract } from '../utils/contract';



const Accountability = () => {
  const account = useActiveAccount();
  const add = account?.address as string;
  const [amount, setAmount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskDescription, setTaskDescription] = useState('');
  const [tasks, setTasks] = useState([]);

  const [money, setMoney] = useState("");

  const { data: depositAmount } = useReadContract({
    contract: contract,
    method: 'getBalance',
    params: [add],
  });

  // if (depositAmount) {
  //   const ethValue = toEther(depositAmount); // Convert BigInt to Ether
  //   console.log(typeof ethValue);
  //   console.log(`Funds in ETH: ${ethValue}`);
  // }

  useEffect(() => {
    if (depositAmount) {
      const ethValue = toEther(depositAmount); // Convert BigInt to Ether
      setMoney(ethValue);
    }
  }, [depositAmount]);

  const { data: taskCount } = useReadContract({
    contract: contract,
    method: 'getTasksCount',
    params: [add],
  });

  const { data: taskComing } = useReadContract({
    contract: contract,
    method: 'getTasks',
    params: [add],
  });

  //console.log(taskComing);

  useEffect(() => {
    if (taskComing) {
      setTasks(taskComing);
    }
  }, [taskComing]);

  useEffect(() => {
   if(depositAmount){
      //console.log(depositAmount.toString());
     setMoney(toEther(depositAmount.toString()))
   }
  },[]);

  if (!account) {
    return <StaticCont />;
  }

  return (
    <div className="accountability-container">
      <div className="accountability-header">
        <h1 className="title">Your Accountability Dashboard</h1>
        <p className="text-small">Account: {account.address}</p>
      </div>
      <div className="accountability-content">
        {depositAmount?.toString() === '0' && taskCount?.toString() === '0' ? (
          <div>
            <h2 className="subtitle">Add funds now</h2>
            <div style={{ marginBottom: '16px' }}>
              <label htmlFor="deposit" className="text-small" style={{ display: 'block', marginBottom: '4px' }}>
                Deposit Amount
              </label>
              <input
                id="deposit"
                type="number"
                placeholder="0.001 ETH"
                className="input"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </div>
            <TransactionButton
              transaction={() =>
                prepareContractCall({
                  contract: contract,
                  method: 'depositFunds',
                  value: BigInt(toWei(amount.toString())),
                })
              }
              onTransactionConfirmed={() => {
                alert('Transaction Confirmed');
                setAmount(0);
              }}
              className="button"
              style={{ width: '100%' }}
            >
              Deposit Funds
            </TransactionButton>
          </div>
        ) : depositAmount?.toString() !== '0' && taskCount?.toString() === '0' && (
          <div>
            <h2 className="subtitle">Your Current Status</h2>
            <h2 className='subtitle1'>Deposited funds: {money}</h2>
            <p style={{ marginBottom: '16px' ,font:'18px'}} className='subtitle1'>Task Count: {taskCount?.toString()}</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="button"
              style={{ width: '100%' }}
            >
              Add Task
            </button>
          </div>
        )}

        {depositAmount?.toString() !== '0' && taskCount?.toString() !== '0' && (
          <>
            <div style={{ marginBottom: '24px' }}>
            <h2 className='subtitle1'>Deposited funds: {money}</h2>
            <p style={{ marginBottom: '16px' ,font:'18px'}} className='subtitle1'>Task Count: {taskCount?.toString()}</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="button"
                style={{ width: '100%' }}
              >
                Add Task
              </button>
            </div>
            <div>
              <h2 className="subtitle">My Tasks</h2>
              <ul className="task-list">
             
              {tasks
  .map((task, originalIndex) => ({ ...task, originalIndex })) // Add original index
  .filter(task => !task.isCompleted) // Only include tasks where isCompleted is false
  .map((taskWithIndex) => (
    <li key={taskWithIndex.originalIndex} className="task-item">
      <span>{taskWithIndex.description}</span>
      <TransactionButton
        transaction={() =>
          prepareContractCall({
            contract: contract,
            method: 'completeTask',
            params: [BigInt(taskWithIndex.originalIndex)], // Use the original index
          })
        }
        onTransactionConfirmed={() => {
          alert('Task completed successfully');
          console.log('Task at original index:', taskWithIndex.originalIndex);
        }}
        onClick={() => console.log('Clicked task at original index:', taskWithIndex.originalIndex)}
        className="button"
        style={{ fontSize: '14px', padding: '6px 12px' }}
      >
        Complete
      </TransactionButton>
    </li>
  ))}


              </ul>
            </div>

          </>
        )}

        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2 className="subtitle">Add New Task</h2>
              <textarea
                placeholder="Enter task description"
                className="textarea"
                style={{ marginBottom: '16px' }}
                rows={4}
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <TransactionButton
                  transaction={() =>
                    prepareContractCall({
                      contract: contract,
                      method: 'createTask',
                      params: [taskDescription],
                    })
                  }
                  onTransactionConfirmed={() => {
                    alert('Task added successfully');
                    setIsModalOpen(false);
                    setTaskDescription('');
                  }}
                  className="button"
                  style={{ flex: 1 }}
                >
                  Add Task
                </TransactionButton>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="button button-secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Accountability;

