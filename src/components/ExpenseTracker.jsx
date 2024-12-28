import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Alert, AlertDescription } from "./ui/alert";
import { Trash2, Plus } from 'lucide-react';
import _ from 'lodash';

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('delivery-expenses');
    return saved ? JSON.parse(saved) : [];
  });

  const [newExpense, setNewExpense] = useState({
    date: new Date().toISOString().split('T')[0],
    category: '',
    amount: '',
    description: ''
  });

  const [showAlert, setShowAlert] = useState('');

  useEffect(() => {
    localStorage.setItem('delivery-expenses', JSON.stringify(expenses));
  }, [expenses]);

  const categories = [
    "Fuel",
    "Vehicle Maintenance",
    "Insurance",
    "Vehicle Payment",
    "Phone/Data",
    "Equipment",
    "Other"
  ];

  const handleAddExpense = () => {
    if (!newExpense.category || !newExpense.amount) {
      setShowAlert('Please fill in all required fields');
      return;
    }

    const expense = {
      id: Date.now(),
      ...newExpense,
      amount: parseFloat(newExpense.amount)
    };

    setExpenses(prev => [...prev, expense]);
    setNewExpense({
      date: new Date().toISOString().split('T')[0],
      category: '',
      amount: '',
      description: ''
    });
    setShowAlert('Expense added successfully');
    setTimeout(() => setShowAlert(''), 3000);
  };

  const handleDeleteExpense = (id) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  // Calculate summary statistics
  const summary = _.chain(expenses)
    .groupBy('category')
    .map((items, category) => ({
      category,
      total: _.sumBy(items, 'amount'),
      count: items.length
    }))
    .value();

  const totalExpenses = _.sumBy(expenses, 'amount');

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Add Expense</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="date"
            value={newExpense.date}
            onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
            className="w-full"
          />
          <select
            value={newExpense.category}
            onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          >
            <option value="">Select Category</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <Input
            type="number"
            placeholder="Amount"
            value={newExpense.amount}
            onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
            step="0.01"
            className="w-full"
          />
          <Input
            type="text"
            placeholder="Description (optional)"
            value={newExpense.description}
            onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
            className="w-full"
          />
          <Button onClick={handleAddExpense} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
          </Button>
        </CardContent>
      </Card>

      {/* Expense Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Expense Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {summary.map(({ category, total, count }) => (
              <div key={category} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="font-medium">{category}</div>
                <div className="text-2xl font-bold mt-1">£{total.toFixed(2)}</div>
                <div className="text-sm text-gray-500">{count} items</div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900 rounded-lg">
            <div className="font-medium">Total Expenses</div>
            <div className="text-2xl font-bold">£{totalExpenses.toFixed(2)}</div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Expenses */}
      {expenses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {expenses.slice().reverse().map(expense => (
                <div key={expense.id} className="flex justify-between items-center py-3">
                  <div>
                    <div className="font-medium">{expense.category}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(expense.date).toLocaleDateString()}
                    </div>
                    {expense.description && (
                      <div className="text-sm text-gray-500">{expense.description}</div>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="font-medium">£{expense.amount.toFixed(2)}</div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteExpense(expense.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {showAlert && (
        <Alert className="fixed bottom-4 left-4 right-4">
          <AlertDescription>{showAlert}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ExpenseTracker;