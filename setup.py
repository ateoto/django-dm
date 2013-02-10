from setuptools import setup

version = __import__('dm').__version__

setup(name='django-dm',
    version=version,
    author='Matthew McCants',
    author_email='mattmccants@gmail.com',
    description='D&D Dungeon Master App',
    license='BSD',
    url='https://github.com/Ateoto/django-dm',
    packages=['dm'],
    install_requires=['django>=1.4'])
