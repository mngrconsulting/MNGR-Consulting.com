a=input("Bazada Məhsul Mövcuddurmu?:(Hə vəya Yox Cavab verilməlidir!)")

if a=="Yox":
    b=input("Məhsulun adını daxil edin:")
    c=int(input("Məhsulun Alış Qiymətini Daxil edin:"))
    d=int(input("Məhsulun Satış Qiymətini Daxil Edin:"))
    e=int(input("Məhsulun Miqdarı:"))
    print(a,b,c,d,e,"Məhsulun Ümumi Alış Qiyməti=",round(c*e),"Məhsulun Ümumi satış Qiyməti=",round(d*e),"Məhsuludan Əldə Olunan Gəlir=",round(c*e-d*e))
#elif a=="Hə":
#    z=list(input("Məhsulun adını daxil edin:").split())
#    b=input("Məhsulun adını daxil edin:")
#    M1=int(input('Mədaxil:'))
#    M2=int(input("Məxaric:"))
#    
