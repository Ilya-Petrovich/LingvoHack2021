from django.shortcuts import render


def index(request):
    return render(request, 'main/index.html')


def ex1_1(request):
    return render(request, 'main/ex1_1.html')


def ex1_2(request):
    return render(request, 'main/ex1_2.html')
