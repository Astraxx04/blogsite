---
title: "Beginner's guide to Go"
postKey: "post-2"
excerpt: "Go, commonly known as GoLang, is a modern statically typed programming language developed by Google that emphasizes simplicity, efficiency, and concurrency."
coverImage: "/assets/blog/go-beginner-guide/cover.png"
date: "2024-04-16T10:00:00.000Z"
author:
  name: Gagan S
  picture: "/assets/blog/authors/gagan_img1.jpeg"
ogImage:
  url: "/assets/blog/go-beginner-guide/cover.png"
---

---

Get Set, Go! Explore the World of Go Programming.

If you’re ready to move on from JavaScript/Node and explore a faster, more efficient language, Go is the way to go. Go Lang offers superior performance and efficiency along with robust concurrency support, efficient compilation, and a powerful standard library. Go emerges as a compelling choice for developers seeking to elevate their coding prowess. So, if you’re seeking a language that not only promises speed but also fosters a seamless development experience, consider embarking on your journey with Go.

---

## Introduction

Go also known as GoLang is an open-source programming language developed by Google. It is known for its simplicity, efficiency, and concurrency amongst other things. Go combines the speed of a compiled language with the ease of use of interpreted languages, making it ideal for building scalable and concurrent applications.

As Go is developed by Google, there’s a huge community supporting the language. Combined with a standard library that provides all the necessary functionalities and several third party packages Go is the ideal language for development.

---

## First Program - Hello Go!

Let’s dive into writing your first Go program! Create a new file named "hello.go" and add the following code:

```go
package main

import "fmt"

func main() {
    fmt.Println("Hello Go!")
}
```

Save the file and run it using the command `go run hello.go`. You should see the output "Hello, Go!" printed to the console. 

Congratulations! You've just written and executed your first Go program.

---

## Go Output Functions

Go has three functions to output text to the standard output provided by `fmt` package - `Print()`, `Println()`, `Printf()`.

- The `Print` function in Go is used to output text without appending a newline character.
- The `Println` function in Go is used to output text with an appended newline character, which starts a new line after each call.
- The `Printf` function in Go is used for formatted output. It allows you to specify placeholders `%s` and `%d` for strings and integers respectively, and provides a way to insert variables into the formatted string.

```go
package main

import "fmt"

func main() {
    name := "John"
    age := 30
    fmt.Print("Hello, ")
    fmt.Println("World!")
    fmt.Println("Happy learning!")
    fmt.Printf("Name: %s, Age: %d\n", name, age)
}
```
- Additionally, the fmt package also contains three functions which are used to format strings or concatenate values into a single string without directly printing them to the standard output. These include `Sprint`, `Sprintln`, and `Sprintf`.
- The `Sprint` function in Go is used to concatenate strings without printing them to the standard output. It returns the concatenated string, which can then be stored in a variable or used directly.
- The `Sprintln` function in Go is similar to sprint, but it appends a newline character after each string concatenation. It's useful for building multi-line strings without printing them directly.
- The `Sprintf` function in Go is similar to printf, but it formats strings with placeholders and returns the formatted string instead of printing it directly. It's useful for generating formatted strings that can be stored in variables or used in further processing.

```go
package main

import "fmt"

func main() {
    name := "John"
    age := 30
    result1 := fmt.Sprint("Hello, ", "World!")
    fmt.Println(result1)
    result2 := fmt.Sprintln("Hello,")
    result2 += fmt.Sprintln("World!")
    fmt.Println(result2)
    result3 := fmt.Sprintf("Name: %s, Age: %d", name, age)
    fmt.Println(result3)
}
```

---

## Go Input Functions

In Go, input operations typically involve reading user input from the standard input stream and processing it within your program. The fmt package provides several functions for handling input operations - Scan() , Scanln() and Scanf() .

- The `Scan` function reads user input from the standard input stream and stores it in the variable provided as arguments.
- The `Scanln` function reads input from standard input, separated by whitespace, and stores it in the specified variables.
- The `Scanf` function reads formatted input from standard input, similar to scanf in C. It takes a format string as the first argument, followed by variables where the parsed values will be stored.

```go
package main

import "fmt"

func main() {
    var num int
    fmt.Scan(&num)
    
    var name string
    var age int
    fmt.Scanln(&name, &age)

    var name string
    var age int
    fmt.Scanf("%s %d", &name, &age)
}
```

When dealing with strings that span over multiple words or lines, it’s advisable to use the `NewReader` function defined in the `bufio` package. This function creates a buffered reader that allows reading input line by line.

- A new buffered reader is created using `bufio.NewReader()` function, which wraps the os.Stdin (standard input) stream.
- This `reader` will allow reading input from the user line by line.
- The `ReadString('\n')` method is called on the `reader` to read input until a newline character `('\n')` is encountered.
- The input string is stored in the variable `text`, and any error that occurs during reading is stored in the `err` variable.
- The `TrimSuffix()` function from the `strings` package is used to remove trailing newline characters `('\n')` and carriage return characters `('\r')` from the input string text.

```go
package main

import (
    "fmt"
    "bufio"
    "os"
)

func main() {
    reader := bufio.NewReader(os.Stdin)
    text, err := reader.ReadString('\n')
    if err != nil {
      return ""
    }
    text = strings.TrimSuffix(text, "\n")
    text = strings.TrimSuffix(text, "\r")
    fmt.Println(text) 
}
```

---

## Variables
In Go, variables are declared using the var keyword followed by the variable name and type, like so:

```go
var message string
message = "Hello, Go!"

var num int = 10
```

You can also declare a variable using :=

```go
name := "John"
```

In Go, it is possible to declare multiple variables in the same line.

```go
var a, b, c, d int = 1, 3, 5, 7
```

---

## Types

Go is a statically typed language, which means that variables must have a specific type. Common types in Go include `int`, `string`, `float` , and `bool`. 

In Go the variables which are declared without a value are given default values:

- int : 0
- float32/ float64 : 0.0
- bool : false
- string : “”

```go
var a bool = true    
var b int = 5       
var c float64 = 3.14  
var d string = "Go!"
```

---

## Structs

Structs allow you to create custom data types with multiple fields. To declare a structure in Go, use the `type` and `struct` keywords:

```go
package main

import "fmt"

type Person struct {
    name string
    age  int
    employed bool
}

func main() {
    var pers1 Person
    pers1.name = "Vibu"
    pers1.age = 22
    pers1.employed = true
    fmt.Println(pers1)
}
```

To access any member of a structure, use the dot operator (.) between the structure variable name and the structure member.

---

## Arrays

Arrays in Go have a fixed size that is determined at compile time. Once declared, the size cannot be changed. Arrays are used to store multiple values of the same type in a single variable, instead of declaring separate variables for each value.

```go
package main

import "fmt"

func main() {
    arr1 := [3]int{1, 2, 3}
    var arr2 = [3]int{10, 20, 30}

    fmt.Println("Array1:", arr1)
    fmt.Println("Array1:", arr2)
}
```

- You can access a specific array element by referring to the index number. In Go, array indexes start at 0. That means that [0] is the first element, [1] is the second element, etc.
- You can also change the value of a specific array element by referring to the index number.
- If an array or one of its elements has not been initialized in the code, it is assigned the default value of its type.
- The `len()` function is used to find the length of an array.
package main

```go
import (
    "fmt"
)

func main() {
    var numbers [5]int

    numbers[0] = 10
    numbers[1] = 20
    numbers[2] = 30
    numbers[3] = 40
    numbers[4] = 50

    fmt.Println("Element at index 0:", numbers[0])
    fmt.Println("Element at index 1:", numbers[1])

    numbers[2] = 35
    fmt.Println("Element at index 2 after modification:", numbers[2])

    fmt.Println("Length of the array:", len(numbers))
}
```

---

## Slices

Slices are dynamic and flexible. They are like dynamic arrays. Slices are created using square brackets [ ] without specifying a size, or by using the make() function.

```go
package main

import "fmt"

func main() {
    myslice := []int{1,2,3}
    
    var slice []int
    slice = append(slice, 1)
    slice = append(slice, 2)
    slice = append(slice, 3)

    newslice := make([]int, 5, 10)

    fmt.Println("Slice:", slice)
}
```

The `append()` function is used to append elements at the end of the slice. You can access a specific slice element by referring to the index number.

In Go, there are two functions that can be used to return the length and capacity of a slice:

- `len()` function - returns the length of the slice (the number of elements in the slice)
- `cap()` function - returns the capacity of the slice (the number of elements the slice can grow or shrink to)

The `make()` function can also be used to create a slice. The second argument refers to the length of the slice and the third argument refers to its capacity. If the capacity parameter is not defined, it will be equal to length.

---

## If-Else Statements

In Go, `if-else` statements are used to control the flow of execution based on certain conditions. They allow you to execute different blocks of code depending on whether a condition evaluates to true or false.

```go
package main

import "fmt"

func main() {
    time := 22
    if time < 10 {
        fmt.Println("Good morning.")
    } else if time < 20 {
        fmt.Println("Good day.")
    } else {
        fmt.Println("Good evening.")
    }
}
```

A point to note is that having the else brackets in a different line will raise an error.

---

## Switch Statements

In Go, `switch` statements provide a way to execute different blocks of code based on the value of an expression. They offer a concise and efficient alternative to multiple `if-else` statements, especially when dealing with multiple conditions.

```go
package main

import "fmt"

func main() {
    day := "Saturday"

    switch day {
    case "Monday":
        fmt.Println("It's Monday!")
    case "Tuesday", "Wednesday", "Thursday":
        fmt.Println("It's a weekday!")
    case "Friday":
        fmt.Println("TGIF! It's Friday!")
    case "Saturday", "Sunday":
        fmt.Println("It's the weekend!")
    default:
        fmt.Println("Invalid day!")
    }
}
```

The `default` keyword is optional. It specifies some code to run if there is no `case` match. The `switch` statement in Go is similar to the ones in C, C++, Java, and JavaScript. The difference is that it only runs the matched case so it does not need a `break` statement.

---

## Loops

In Go, loops are used to repeatedly execute a block of code until a specific condition is met. They provide a way to automate repetitive tasks and iterate over collections of data.

```go
package main

import "fmt"

func main() {
    for i := 0; i < 5; i++ {
        fmt.Println("Number: ", i)
    }
}
```

- i:=0; — Initialize the loop counter (i), and set the start value to 0
- i < 5; — Continue the loop as long as i is less than 5
- i++ — Increase the loop counter value by 1 for each iteration

The `continue` statement is used to skip one or more iterations in the loop. It then continues with the next iteration in the loop.
The `break` statement is used to break/terminate the loop execution.

```go
package main

import "fmt"

func main() {
    for i:=0; i < 5; i++ {
        if i == 3 {
        continue
        }
        if i == 4 {
        break
        }
    fmt.Println(i)
    }
}
```

The `range` keyword is used to more easily iterate over an array, slice or map. It returns both the index and the value.

```go
package main

import "fmt"

func main() {
    fruits := [3]string{"apple", "orange", "banana"}
    for idx, val := range fruits {
        fmt.Printf("%v\t%v\n", idx, val)
    }
}
```

---

## Maps

Maps are used to store data values in key:value pairs. Each element in a map is a key:value pair. A map is an unordered and changeable collection that does not allow duplicates. You can create a map like this:

```go
package main

import "fmt"

func main() {
  var a = map[string]string{"country": "India", "state": "Karnataka", "city": "Bengaluru"}
  b := map[string]float64{"Interstellar": 9.9, "Oppenheimer": 9.4}

  fmt.Printf("a\t%v\n", a)
  fmt.Printf("b\t%v\n", b)
}
```

- You can also create a map by using the `make()` function.
- Removing elements from a map is done using the `delete()` function.

```go
package main

import "fmt"

func main() {
  var a = make(map[string]string)
  a["brand"] = "Ford"
  a["model"] = "Mustang"
  a["year"] = "1964"
  delete(a,"model")
  fmt.Printf(a["brand"])
}
```

---

## Functions

Functions in Go are declared using the func keyword. Here's a simple function that adds two numbers:
package main

```go
import "fmt"

func add(a int, b int) (int) {
    return a + b
}

func main() {
    sum := add(5, 10)
    fmt.Println(sum)
}
```

If you want the function to return a value, you need to define the data type of the return value (such as `int`, `string`, etc), and also use the `return` keyword inside the function.

In Go, you can name the return values of a function. It can also return multiple values.

If the type of all the parameters is the same, you can just specify the type once.

If you(for some reason) do not want to use some of the returned values, you can add an underscore `(_)`, to omit this value.

```go
package main

import "fmt"

func operation(a, b int) (sum int, diff int, mul int) {
    return a + b, a - b, a * b
}

func main() {
    sum, diff, _ := operation(5, 10)
    fmt.Println(sum, diff)
}
```

---

## Methods

In Go, methods are functions associated with a particular type. Methods in Go provide a way to attach functions to structs or any other user-defined types. Here’s a brief overview of methods in Go and how to define them:

```go
package main

import "fmt"

type Rectangle struct {
    width, height float64
}

func (r Rectangle) area() float64 {
    return r.width * r.height
}

func main() {
    rect := Rectangle{width: 10, height: 5}

    fmt.Println("Area of the rectangle:", rect.area())
}
```

The method in Go is similar to a function except it has a receiver defined before the name of the method. The receiver can be of any named type or a pointer to a named type. The receiver is similar to `this` or `self` in other programming languages.

---

## Interfaces

Interfaces in Go allow you to define behavior that a type must implement. They define a set of method signatures, and any type that implements these methods implicitly satisfies the interface. Here’s an example of defining an interface and implementing it:

```go
package main

import "fmt"

type Shape interface {
    Area() float64
}

type Rectangle struct {
    width, height float64
}

func (r Rectangle) Area() float64 {
    return r.width * r.height
}

type Circle struct {
    radius float64
}

func (c Circle) Area() float64 {
    return 3.14 * c.radius * c.radius
}

func main() {
    rect := Rectangle{width: 5, height: 3}
    circle := Circle{radius: 2}

    fmt.Println("Area of Rectangle:", rect.Area())
    fmt.Println("Area of Circle:", circle.Area())
}
```

In this example:
- We define an interface `Shape` with a single method signature `Area()` `float64`.
- We define two structs `Rectangle` and `Circle`, each with methods that satisfy the `Shape` interface.
- We create instances of `Rectangle` and `Circle` and call the `Area()` method on them.
- Both types (`Rectangle` and `Circle`) satisfy the `Shape` interface because they implement the `Area()` method, allowing us to treat them interchangeably where `Shape` is expected.

---

## Pointers

Pointers allow you to pass references to values rather than the values themselves. They allow you to indirectly access and manipulate the memory where values are stored. Pointers are used extensively in Go for efficient memory management and to avoid unnecessary copying of data. Here’s how you can use pointers in Go:

```go
package main

import "fmt"

func main() {
    var num int = 10

    var ptr *int

    ptr = &num

    fmt.Println("Value of num:", num)
    fmt.Println("Value of num through pointer:", *ptr)

    *ptr = 20
    fmt.Println("Modified value of num:", num)
}
```

In this example:

- We declare a variable `num` and initialize it with the value `10`.
-We declare a pointer variable `ptr` of type `*int`.
- We assign the memory address of `num` to the pointer `ptr` using the `&` operator.
- We access the value of num indirectly through the pointer using the `*` operator `(*ptr)`.
- We modify the value of `num` indirectly through the pointer, and the change is reflected in the original variable.

---

## Packages

In Go, packages are used to organize code into reusable and modular units. They provide a way to encapsulate related functionality, promote code reuse, and simplify maintenance.

To define a package in Go, you create a directory with the same name as the package, and within that directory, you create one or more `.go` files containing the package code. Each file in the package directory typically begins with a `package` declaration specifying the name of the package.

```go
package math_operations

func Add(a, b int) int {
    return a + b
}

func Subtract(a, b int) int {
    return a - b
}
```

- **Importing Functions**: To use functions from a package in your Go program, you import the package using the import keyword followed by the package path.
- **Exporting Functions**: In Go, functions and other identifiers are exported from a package if their names begin with a capital letter. So if the functions are to be exported to other packages, the function name must start with a capital letter.

```go
package main

import (
    "fmt"
    "package/path/math_operations"
)

func main() {
    fmt.Println("Addition:", math_operations.Add(5, 3))
    fmt.Println("Subtraction:", math_operations.Subtract(10, 3))
    fmt.Println("Multiplication:", math_operations.Multiply(4, 6))
}
```

In this example:

- We import the `math_operations` package and use its exported functions `Add` and `Subtract`.
- We import and use the exported function `Multiply` from the `math_operations` package.
- By organizing code into packages and exporting functions, we achieve code reuse and maintainability in our Go programs.

---

## Conclusion

Trying out new languages can totally level up how you solve problems as a developer because it makes you think in new ways. And being comfy with different tools is key because you never know when you’ll need a fresh approach for a tricky problem.

Now, let’s be real, learning Go might feel like a bit of a rollercoaster compared to JavaScript. But trust me, it’s worth it. Google made Go to handle big-scale stuff, which means it’s perfect for teams dealing with tons of work and heavy-duty server action. With some dedication and practice, you can really grasp the concepts and apply them in real-world situations.

Here are some of the links and courses which helped me in getting started with go:

- [Go the complete guide](https://www.udemy.com/share/109Zo23@zmeyp13QvDYhk_KsRgtG6eAnDfv7poVSU4Hu13XC7hINLP0ecE_WBTylMOVxk-b2/)
- [Go Docs](https://go.dev)
- [Go Playground](https://go.dev/play/)
- [Basics-Github](https://github.com/Astraxx04/GoLangBasics)

Thankyou!

---