---
title: "Data Structures and Algorithms"
postKey: "post-4"
excerpt: "Learning Data Structures and Algorithms (DSA) is a crucial step for becoming a better programmer. In this series, I share my solutions for the LeetCode 75 questions, aimed at helping others understand core concepts and improve problem-solving skills."
coverImage: "/assets/blog/dsa-tracker/cover.png"
date: "2025-07-21T10:00:00.000Z"
author:
  name: Gagan S
  picture: "/assets/blog/authors/gagan_img1.jpeg"
ogImage:
  url: "/assets/blog/dsa-tracker/cover.png"
---

---

I’ve always believed that mastering Data Structures and Algorithms (DSA) is less about memorizing patterns and more about understanding how and why things work under the hood. As I work through various LeetCode problems—especially the [LeetCode 75](https://leetcode.com/studyplan/leetcode-75/) series—I’ve found it helpful to document my solutions, thought processes, and the concepts I’m revisiting along the way.

This blog is my personal space to track my progress, consolidate what I’ve learned, and make it easier to revise these ideas later. It’s not just a collection of answers but also a reflection of how I approach problems, where I struggled, and how I optimized my solutions. Hopefully, this will also serve as a useful reference for anyone walking a similar path in their DSA journey.

---

## Arrays

1. [Merge Strings Alternately](https://leetcode.com/problems/merge-strings-alternately/description/)

```python
def mergeAlternately(self, word1: str, word2: str) -> str:
    i = 0
    word = ""
    max_len = max(len(word1), len(word2))
    while(i < max_len):
        if i < len(word1):
            word = word + word1[i]
        if i < len(word2):
            word = word + word2[i]
        i += 1

    return word
```

2. [Greatest Common Divisor of Strings](https://leetcode.com/problems/greatest-common-divisor-of-strings/description/)

```python
def gcdOfStrings(self, str1: str, str2: str) -> str:
    if str1 + str2 != str2 + str1:
        return ""

    def gcd(a, b):
        while b != 0:
            a, b = b, a % b
        return a

    if a == 0:
        return ""

    return str1[:gcd(len(str1), len(str2))]
```

3. [Kids With the Greatest Number of Candies](https://leetcode.com/problems/kids-with-the-greatest-number-of-candies/description/)

```python
def kidsWithCandies(self, candies: List[int], extraCandies: int) -> List[bool]:
    max_candies = max(candies)
    res = []
    for i in range(len(candies)):
        if candies[i] + extraCandies >= max_candies:
            res.append(True)
        else:
            res.append(False)
    return res
```

4. [Can Place Flowers](https://leetcode.com/problems/can-place-flowers/description/)

```python
def canPlaceFlowers(self, flowerbed: List[int], n: int) -> bool:
    count = 0
    for i in range(len(flowerbed)):
        left = i == 0 or flowerbed[i-1] == 0
        right = i == len(flowerbed) - 1 or flowerbed[i+1] == 0

        if left and right and flowerbed[i] == 0:
            flowerbed[i] = 1
            count += 1
    
    return count >= n
```

5. [Reverse Vowels of a String](https://leetcode.com/problems/reverse-vowels-of-a-string/description/)

```python
def reverseVowels(self, s: str) -> str:
    s = list(s)
    n = len(s)

    vowels = set('AEIOUaeiou')

    l = 0
    r = n - 1

    while(l<r):
        while l<r and s[l] not in vowels:
            l += 1
        while l<r and s[r] not in vowels:
            r -= 1

        s[l], s[r] = s[r], s[l]
        l += 1
        r -= 1

    return "".join(s)
```

6. [Delete Characters to Make Fancy String](https://leetcode.com/problems/delete-characters-to-make-fancy-string/description/)

```python
def makeFancyString(self, s: str) -> str:
    ans = s[0]
    cnt = 1
    for i in range(1, len(s)):
        if s[i] == ans[-1]:
            cnt += 1
            if cnt < 3:
                ans += s[i]
        else:
            cnt = 1
            ans += s[i]
    return ans
```

7. [Reverse Words in a String](https://leetcode.com/problems/reverse-words-in-a-string/description/)

```python
def reverseWords(self, s: str) -> str:
    words = s.strip().split()
    words.reverse()
    return " ".join(words)
```

---

```python
def reverseWords(self, s: str) -> str:
    s = s + " "
    ns = ""
    ts = ""
    for x in s:
        if x != " ":
            ts = ts + x
        else:
            ns = ts.strip() + " " + ns.strip()
            ts = ""
    return ns.strip()         
```

8. [Product of Array Except Self](https://leetcode.com/problems/product-of-array-except-self/description/)

```python
def productExceptSelf(self, nums: List[int]) -> List[int]:
    output = [1] * len(nums)

    left = 1
    for i in range(len(nums)):
        output[i] = output[i] * left
        left = left * nums[i]
    
    right = 1
    for i in range(len(nums)-1, -1, -1):
        output[i] = output[i] * right
        right = right * nums[i]

    return output     
```

9. [Increasing Triplet Subsequence](https://leetcode.com/problems/increasing-triplet-subsequence/description/)

```python
def increasingTriplet(self, nums: List[int]) -> bool:
    first = second = max(nums)
    for num in nums:
        if num <= first:
            first = num
        elif num <= second:
            second = num
        else:
            return True
    return False 
```

10. [String Compression](https://leetcode.com/problems/string-compression/description/)

```python
def compress(self, chars: List[str]) -> int:
    ans = 0
    i = 0

    while(i < len(chars)):
        letter = chars[i]
        count = 0

        while(i < len(chars) and chars[i] == letter):
            count += 1
            i += 1

        chars[ans] = letter
        ans += 1

        if count > 1:
            for c in str(count):
                chars[ans] = c
                ans += 1

    return ans
```

11. [Maximum Erasure Value](https://leetcode.com/problems/maximum-erasure-value/description/)

```python
def maximumUniqueSubarray(self, nums: List[int]) -> int:
    seen = set()
    left = 0
    current_sum = 0
    max_sum = 0
    
    for right in range(len(nums)):
        while nums[right] in seen:
            current_sum -= nums[left]
            seen.remove(nums[left])
            left += 1
        current_sum += nums[right]
        seen.add(nums[right])
        max_sum = max(max_sum, current_sum)
    
    return max_sum
```
