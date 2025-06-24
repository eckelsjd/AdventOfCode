program day1

use iso_fortran_env, only: input_unit

character(:), allocatable :: fname
integer, allocatable :: list1(:)
integer, allocatable :: list2(:)
integer :: i, j, nrows, total, tmp_cnt, similarity
character(len=100) :: line

fname = "data/day1.txt"
total = 0
similarity = 0

! Open the file using the built-in input_unit
open(unit=input_unit, file=fname, status="old", action="read")

! Count the number of rows in the file
nrows = 0
do
    read(input_unit, '(A)', iostat=iostat) line
    if (iostat /= 0) exit
    nrows = nrows + 1
end do

! Allocate arrays
allocate(list1(nrows), list2(nrows))

! Rewind the file and read the data
rewind(input_unit)
do i = 1, nrows
    read(input_unit, *) list1(i), list2(i)
end do

! Close the file
close(input_unit)

call bubble_sort(list1, nrows)
call bubble_sort(list2, nrows)

do i = 1, nrows
    total = total + abs(int(list1(i) - list2(i)))

    tmp_cnt = 0
    do j = 1, nrows
        if (list2(j) == list1(i)) then
            tmp_cnt = tmp_cnt + 1
        end if
    end do

    similarity = similarity + list1(i) * tmp_cnt
end do

print *, "Total difference: ", total
print *, "Total similarity: ", similarity

contains 

subroutine bubble_sort(arr, n)
    integer, intent(inout) :: arr(:)
    integer, intent(in) :: n
    integer :: i, j, temp

    do i = 1, n - 1
        do j = 1, n - i
            if (arr(j) > arr(j + 1)) then
                temp = arr(j)
                arr(j) = arr(j + 1)
                arr(j + 1) = temp
            end if
        end do
    end do
end subroutine bubble_sort

end program day1
