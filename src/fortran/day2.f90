program day2

use iso_fortran_env, only: input_unit

character(len=100) :: line
character(:), allocatable :: fname
integer :: num_safe, i, nitems, j, skip_idx
integer, allocatable :: items(:), temp(:)
logical :: problem_dampener

fname = 'data/day2.txt'
num_safe = 0
problem_dampener = .true. ! for Part 2

open(unit=input_unit, file=fname, status="old", action="read")

do
    read(input_unit, '(A)', iostat=i) line
    if (i /= 0) exit

    ! Count number of items
    nitems = 0
    do j = 1, len_trim(line)
        if (line(j:j) == ' ') nitems = nitems + 1
    end do
    nitems = nitems + 1

    if (allocated(temp)) deallocate(temp)
    allocate(temp(nitems-1))  ! For part 2

    if (allocated(items)) deallocate(items)
    allocate(items(nitems))
    
    read(line, *) items(1:nitems)

    if (check_safe(items)) then
        num_safe = num_safe + 1
    elseif (problem_dampener) then
        ! Try to remove each item to make the report safe
        do skip_idx = 1, nitems
            if (skip_idx > 1) temp(1:skip_idx-1) = items(1:skip_idx-1)
            if (skip_idx < nitems) temp(skip_idx:nitems-1) = items(skip_idx+1:nitems)

            if (check_safe(temp)) then
                num_safe = num_safe + 1
                exit
            end if
        end do
    end if

end do

if (problem_dampener) then
    print *, "Number of safe reports part 1: ", num_safe
else 
    print *, "Number of safe reports part 2: ", num_safe
end if

close(input_unit)

contains 

logical function check_safe(arr)
    integer, intent(in) :: arr(:)
    logical :: is_increasing
    integer :: j

    check_safe = .true.
    is_increasing = arr(2) > arr(1)

    do j = 1, size(arr) - 1
        if (arr(j+1) == arr(j)) then
            check_safe = .false.
        elseif (is_increasing .and. (arr(j+1) < arr(j))) then
            check_safe = .false.
        elseif (.not. is_increasing .and. arr(j+1) > arr(j)) then
            check_safe = .false.
        elseif (abs(arr(j+1) - arr(j)) > 3) then
            check_safe = .false.
        end if

        if (.not. check_safe) then
            exit
        end if 
    end do

end function check_safe

end program day2