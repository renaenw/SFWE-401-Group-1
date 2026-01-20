import math

# Made by Robert Taylor 

def calculator():
    
    print("Calculator")
    print("Please choose the math operation you want to do")
    print("add")
    print("subtract")
    print("multiply")
    print("division")
    print("sqrt ")
    print("pow")
    print("log (log in base 10) ")
    print("fact")
#Start of all the operations 
    while True:
        operator = input("\nEnter operation: ").lower()
        #Here we have our basic operation of + - * / 
        try:
            if operator in ["add", "subtract", "multiply", "division"]:
                num1 = float(input("Enter first number: "))
                num2 = float(input("Enter second number: "))

                if operator == "add":
                    result = num1 + num2
                elif operator == "subtract":
                    result = num1 - num2
                elif operator == "multiply":
                    result = num1 * num2
                elif operator == "division":
                    if num2 == 0:
                        print("Error: division by zero")
                        continue
                    result = num1 / num2
        #Here are all of the operation we need to do of square root, exponents, log, factorial
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
        #Here is the error catch for if the input is not vaild
        except ValueError:
            print("Invalid input")
        except Exception as e:
            print(f"Error: {e}")

        #This will restart the loop if the user will want to start again or if they just want it to end
        choice = input("\nContinue? (y/n): ").lower()
        if choice != "y":
            print("Calculator closed.")
            break





#this calls the function of calcuator 
def main():
    calculator()

if __name__ == "__main__":
    main()
