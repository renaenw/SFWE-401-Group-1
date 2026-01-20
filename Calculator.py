def calculator():
    print("Simple Calculator")
    print("Operations:")
    print(" +  Addition")
    print(" -  Subtraction")
    print(" *  Multiplication")
    print(" /  Division")

    while True:
        try:
            num1 = float(input("\nEnter first number: "))
            operator = input("Enter operator (+, -, *, /): ")
            num2 = float(input("Enter second number: "))

            if operator == "+":
                result = num1 + num2
            elif operator == "-":
                result = num1 - num2
            elif operator == "*":
                result = num1 * num2
            elif operator == "/":
                if num2 == 0:
                    print("Error: Division by zero")
                    continue
                result = num1 / num2
            else:
                print("Invalid operator")
                continue

            print(f"Result: {result}")

        except ValueError:
            print("Invalid input. Please enter numbers only.")

        choice = input("\nDo you want to continue? (y/n): ").lower()
        if choice != "y":
            print("Calculator closed.")
            break


calculator()
