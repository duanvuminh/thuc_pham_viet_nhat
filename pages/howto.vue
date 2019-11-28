<template lang="md">
# Hướng dẫn tạo nội dung với markdow
1. Markdow là gì
2. Cú pháp cơ bản

## 1.Markdow là gì
Là công cụ hỗ trợ tạo nội dung đơn giản

### Cú pháp 1

````html  

# h1
## h2
### h3
````
Hiển thị
# h1
## h2
### h3

### Cú pháp 2

````html  

**In đậm**
__In đậm__
````
Hiển thị
**In đậm**
__In đậm__

### Cú pháp 3

````html  

**In đậm**
__In đậm__
_In nghiêng_
~~Gạch ngang chữ~~
````
Hiển thị
**In đậm**
__In đậm__
_In nghiêng_
~~Gạch ngang chữ~~

### Cú pháp 4

````html  

Tạo danh sách
* item1
* item2

+ item1
+ item2

- item1
- item2

1. item1
2. item2
````
Hiển thị
* item1
* item2

+ item1
+ item2

- item1
- item2

1. item1
2. item2
### Cú pháp 5

````link  

Tạo link
[vue-markdown](https://github.com/miaolz123/vue-markdown)

Tạo Image
![Minion](https://miaolz123.github.io/vue-markdown/dist/img/minion.png)

Tạo video
@[youtube](https://www.youtube.com/watch?v=f_LgWgzCPnQ)
````
Hiển thị
Tạo link
[vue-markdown](https://github.com/miaolz123/vue-markdown)

Tạo Image
![Minion](https://miaolz123.github.io/vue-markdown/dist/img/minion.png)

Tạo video
@[youtube](S36B4WHrz-c)

### Cú pháp 6
Các hình icon từ điện thoại
````

😃
````
Hiển thị
😃

### Cú pháp 7
````
Bảng
|  Tên lệch trái  |  Xếp hạng căn giữa  |  Tài sản căn phải  |
|:---|:---:|---:|   //dòng này dùng : để căn
|Hoà|A|10000|
|Hải|B|9000|
|Hưng|A|15000|

````
Hiển thị
| Tên lệch trái| Xếp hạng căn giữa | Tài sản căn phải |
|:---|:---:|---:|
|Hoà|A|10000|
|Hải|B|9000|
|Hưng|A|15000|
</template>

<script>
export default {
  layout: "normal"
};
</script>
<style>
code {
    width: 100%;
    background-color: #282c34!important;
    color: white!important;
    box-shadow: none!important;
    padding: 0 15px 0 15px;
}
</style>