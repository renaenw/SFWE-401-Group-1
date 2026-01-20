import math

def calculator():
    print("Calculator with Math Library")
    print("\nBasic Operations:")
    print(" +    Addition")
    print(" -    Subtraction")
    print(" *    Multiplication")
    print(" /    Division")
    print("\nMath Operations:")
    print(" sqrt Square root")
    print(" pow  Power")
    print(" log  Logarithm (base 10)")
    print(" fact Factorial")

    while True:
        operator = input("\nEnter operation: ").lower()

        try:
            if operator in ["+", "-", "*", "/"]:
                num1 = float(input("Enter first number: "))
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

            elif operator == "sqrt":
                num = float(input("Enter number: "))
                if num < 0:
                    print("Error: Cannot take square root of a negative number")
                    continue
                result = math.sqrt(num)

            elif operator == "pow":
                base = float(input("Enter base: "))
                exp = float(input("Enter exponent: "))
                result = math.pow(base, exp)

            elif operator == "log":
                num = float(input("Enter number: "))
                if num <= 0:
                    print("Error: Logarithm undefined for zero or negative numbers")
                    continue
                result = math.log10(num)

            elif operator == "fact":
                num = int(input("Enter a whole number: "))
                if num < 0:
                    print("Error: Factorial of negative number not allowed")
                    continue
                result = math.factorial(num)

            else:
                print("Invalid operation")
                continue

            print(f"Result: {result}")

        except ValueError:
            print("Invalid input")
        except Exception as e:
            print(f"Error: {e}")

        choice = input("\nContinue? (y/n): ").lower()
        if choice != "y":
            print("Calculator closed.")
            break


calculator()
