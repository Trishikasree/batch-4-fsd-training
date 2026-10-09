# Personal Expense Calculator

# Get income
income = float(input("Enter your monthly income: ₹"))

# Initialize expense categories
food = 0
transport = 0
education = 0
shopping = 0
bills = 0
other = 0

# Get number of expenses
n = int(input("How many expenses do you want to enter? "))

# Enter expenses
for i in range(n):
    print("\nExpense", i + 1)

    category = input(
        "Enter category (food/transport/education/shopping/bills/other): "
    ).lower()

    amount = float(input("Enter amount: ₹"))

    # Categorize expense
    if category == "food":
        food += amount

    elif category == "transport":
        transport += amount

    elif category == "education":
        education += amount

    elif category == "shopping":
        shopping += amount

    elif category == "bills":
        bills += amount

    elif category == "other":
        other += amount

    else:
        print("Invalid category!")

# Calculate total expenses
total_expenses = food + transport + education + shopping + bills + other

# Calculate savings
savings = income - total_expenses

# Display summary
print("\n========== EXPENSE SUMMARY ==========")

print("Total Income   : ₹", income)
print("Total Expenses : ₹", total_expenses)
print("Total Savings  : ₹", savings)

print("\nCategory-wise Expenses:")
print("Food           : ₹", food)
print("Transport      : ₹", transport)
print("Education      : ₹", education)
print("Shopping       : ₹", shopping)
print("Bills          : ₹", bills)
print("Other          : ₹", other)

# Savings status
if savings > 0:
    print("\nYou have saved money this month.")

elif savings == 0:
    print("\nYour income and expenses are equal.")

else:
    print("\nYou have spent more than your income.")